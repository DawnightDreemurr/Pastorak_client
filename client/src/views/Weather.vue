<template>
  <div class="w-full space-y-4">
    <!-- 顶部预警长条（无预警自动不显示） -->
    <WeatherAlerts :locationCode="LOCATION_CODE" />

    <main class="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <section class="lg:col-span-4">
        <CurrentWeatherCard
          class="h-full"
          :locationCode="LOCATION_CODE"
          :locationName="LOCATION_NAME"
        />
      </section>

      <section class="lg:col-span-8">
        <MinutePrecipChart class="h-full" :locationCode="LOCATION_CODE" />
      </section>

      <section class="lg:col-span-7">
        <HourlyForecast class="h-full" :locationCode="LOCATION_CODE" />
      </section>

      <section class="lg:col-span-5">
        <DailyForecast class="h-full" :locationCode="LOCATION_CODE" />
      </section>

      <section class="lg:col-span-6">
        <AirQualityCard class="h-full" :locationCode="LOCATION_CODE" />
      </section>

      <section class="lg:col-span-6">
        <WeatherIndices class="h-full" :locationCode="LOCATION_CODE" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard.vue'
import AirQualityCard from '@/components/weather/AirQualityCard.vue'
import WeatherAlerts from '@/components/weather/WeatherAlerts.vue'
import WeatherIndices from '@/components/weather/WeatherIndices.vue'
import MinutePrecipChart from '@/components/weather/MinutePrecipChart.vue'
import HourlyForecast from '@/components/weather/HourlyForecast.vue'
import DailyForecast from '@/components/weather/DailyForecast.vue'

import { apiGetWeatherAlert } from '@/api/weather.api.js'
import { getLocation } from '@/api/location.api.js'
import { apiGetUserProfile } from '@/api/userProfile.api.js'

// 默认值兜底，防止接口未返回时页面报错
const DEFAULT_LOCATION_CODE = '101060101'
const DEFAULT_LOCATION_NAME = '吉林省长春'

const locationCode = ref(DEFAULT_LOCATION_CODE)
const locationName = ref(DEFAULT_LOCATION_NAME)

const LOCATION_CODE = computed(() => locationCode.value || DEFAULT_LOCATION_CODE)
const LOCATION_NAME = computed(() => locationName.value || DEFAULT_LOCATION_NAME)

/**
 * 仅用于“是否显示预警模块”的轻量判断：
 * - zeroResult=true 或 alerts 为空 => 不显示
 */
const alertMeta = ref({ zeroResult: true, alertsCount: 0 })

async function loadUserDefaultLocation() {
  try {
    const profileRes = await apiGetUserProfile()
    const defaultLocation = profileRes?.data?.defaultLocation || DEFAULT_LOCATION_CODE

    const locationRes = await getLocation({ location: defaultLocation })
    const locationItem = locationRes?.data?.location?.[0]

    locationCode.value = locationItem?.id || defaultLocation || DEFAULT_LOCATION_CODE
    locationName.value =
      `${locationItem?.adm1 || ''}${locationItem?.adm2 || locationItem?.name || ''}` ||
      DEFAULT_LOCATION_NAME
  } catch {
    locationCode.value = DEFAULT_LOCATION_CODE
    locationName.value = DEFAULT_LOCATION_NAME
  }
}

async function probeAlerts() {
  try {
    const res = await apiGetWeatherAlert({ location: LOCATION_CODE.value })
    const zeroResult = Boolean(res?.data?.metadata?.zeroResult)
    const count = Array.isArray(res?.data?.alerts) ? res.data.alerts.length : 0
    alertMeta.value = { zeroResult, alertsCount: count }
  } catch {
    // 探测失败时：宁可不显示，避免占位
    alertMeta.value = { zeroResult: true, alertsCount: 0 }
  }
}

onMounted(async () => {
  await loadUserDefaultLocation()
  await probeAlerts()
})
</script>
