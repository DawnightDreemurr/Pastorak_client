<template>
  <div
    class="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/50"
  >
    <!-- header -->
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">日预报</div>
        <div class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {{ headline || '—' }}
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <span
          v-if="rangeText"
          class="rounded-full border border-amber-200/70 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
          title="未来预报温度范围"
        >
          {{ rangeText }}
        </span>
      </div>
    </div>

    <!-- table header -->
    <div
      class="mt-3 hidden grid-cols-12 gap-2 rounded-xl border border-zinc-200/70 bg-white/50 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-800/70 dark:bg-zinc-950/20 dark:text-zinc-400 sm:grid"
    >
      <div class="col-span-2">日期</div>
      <div class="col-span-4">白天 / 夜间</div>
      <div class="col-span-2 text-right">温度</div>
      <div class="col-span-2 text-right">降水</div>
      <div class="col-span-2 text-right">风 / UV</div>
    </div>

    <!-- list (scroll, no expand button) -->
    <div
      class="mt-2 max-h-[420px] space-y-2 overflow-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(161,161,170,.6)_transparent] dark:[scrollbar-color:rgba(113,113,122,.65)_transparent]"
    >
      <div
        v-for="d in daily"
        :key="d.fxDate"
        class="rounded-xl border border-zinc-200/70 bg-white/60 px-3 py-3 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <!-- mobile layout -->
        <div class="flex items-start justify-between gap-3 sm:hidden">
          <div class="min-w-0">
            <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ formatMd(d.fxDate) }}
              <span class="text-xs text-zinc-500 dark:text-zinc-400">{{
                weekdayCn(d.fxDate)
              }}</span>
            </div>

            <div class="mt-2 flex items-center gap-2">
              <div
                class="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200/70 bg-white/70 dark:border-zinc-800/70 dark:bg-zinc-900/40"
                title="白天"
              >
                <i :class="`qi-${d.iconDay}`" class="text-xl text-zinc-800 dark:text-zinc-100"></i>
              </div>

              <div class="min-w-0">
                <div class="truncate text-sm text-zinc-800 dark:text-zinc-200">
                  {{ d.textDay }} /
                  <span class="text-zinc-600 dark:text-zinc-300">{{ d.textNight }}</span>
                </div>
                <div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  风 {{ d.windScaleDay }}级 · 降水 {{ safeNum(d.precip) }} mm · UV
                  {{ safeNum(d.uvIndex) }}
                </div>
              </div>
            </div>
          </div>

          <div class="text-right">
            <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ d.tempMax }}° / {{ d.tempMin }}°
            </div>
            <div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">高 / 低</div>
          </div>
        </div>

        <!-- desktop grid layout -->
        <div class="hidden grid-cols-12 items-center gap-2 sm:grid">
          <!-- date -->
          <div class="col-span-2">
            <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ formatMd(d.fxDate) }}
            </div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400">
              {{ weekdayCn(d.fxDate) }}
            </div>
          </div>

          <!-- day/night -->
          <div class="col-span-4 flex items-center gap-2">
            <div
              class="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200/70 bg-white/70 dark:border-zinc-800/70 dark:bg-zinc-900/40"
              title="白天"
            >
              <i :class="`qi-${d.iconDay}`" class="text-xl text-zinc-800 dark:text-zinc-100"></i>
            </div>

            <div class="min-w-0">
              <div class="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {{ d.textDay }}
                <span class="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                  / {{ d.textNight }}</span
                >
              </div>
              <div class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                白天风 {{ d.windScaleDay }}级 · 夜间风 {{ d.windScaleNight }}级
              </div>
            </div>
          </div>

          <!-- temp -->
          <div class="col-span-2 text-right">
            <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ d.tempMax }}° / {{ d.tempMin }}°
            </div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400">高 / 低</div>
          </div>

          <!-- precip -->
          <div class="col-span-2 text-right">
            <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ safeNum(d.precip) }}
              <span class="text-xs font-normal text-zinc-500 dark:text-zinc-400">mm</span>
            </div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400">
              湿度 {{ safeNum(d.humidity) }}%
            </div>
          </div>

          <!-- wind/uv -->
          <div class="col-span-2 text-right">
            <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              UV {{ safeNum(d.uvIndex) }}
            </div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400">
              气压 {{ safeNum(d.pressure) }} hPa
            </div>
          </div>
        </div>
      </div>

      <div v-if="!daily.length" class="py-6 text-sm text-zinc-500 dark:text-zinc-400">加载中…</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { apiGetDailyWeather } from '@/api/weather.api.js'

const props = defineProps({
  locationCode: { type: String, required: true },
})

const result = ref(null)

async function loadWeather() {
  result.value = await apiGetDailyWeather({
    location: props.locationCode,
  })
}

watch(
  () => props.locationCode,
  () => loadWeather(),
  { immediate: true },
)

const daily = computed(() => result.value?.data?.daily || [])

const rangeText = computed(() => {
  if (!daily.value.length) return ''
  const maxs = daily.value.map((d) => Number(d.tempMax))
  const mins = daily.value.map((d) => Number(d.tempMin))
  const hi = Math.max(...maxs)
  const lo = Math.min(...mins)
  return `${lo}° ~ ${hi}°`
})

const headline = computed(() => {
  if (!daily.value.length) return ''
  const d0 = daily.value[0]
  // 简洁：今天（第一天）的白天/夜间
  return `${formatMd(d0.fxDate)} ${d0.textDay} / ${d0.textNight}`
})

function safeNum(v) {
  if (v === undefined || v === null || v === '') return '—'
  const n = Number(v)
  if (Number.isNaN(n)) return '—'
  // 降水可能是小数，其它多为整数
  if (String(v).includes('.')) return n.toFixed(1)
  return String(n)
}

function formatMd(dateStr) {
  if (!dateStr) return '—'
  const [, m, d] = dateStr.split('-')
  return `${m}/${d}`
}

function weekdayCn(dateStr) {
  try {
    const dt = new Date(dateStr + 'T00:00:00')
    const map = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return map[dt.getDay()]
  } catch {
    return ''
  }
}
</script>
