<template>
  <div
    class="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/50"
  >
    <!-- header -->
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">空气质量</div>
        <div class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          <span v-if="aqi">{{ aqi.name }}</span>
          <span v-else>—</span>
        </div>
      </div>

      <div v-if="aqi" class="flex shrink-0 items-center gap-2">
        <span
          class="rounded-full border px-2 py-0.5 text-xs font-medium "
          :style="aqiBadgeStyle"
          :title="aqi.category"
        >
          AQI {{ aqi.aqiDisplay }}
        </span>
        <span
          class="rounded-full border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950/20 dark:text-zinc-300"
        >
          {{ aqi.category }}
        </span>
      </div>
    </div>

    <!-- main -->
    <div v-if="aqi" class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <!-- left: effect + advice -->
      <div class="space-y-3">
        <div
          class="rounded-xl border border-zinc-200/70 bg-white/60 p-3 dark:border-zinc-800/70 dark:bg-zinc-950/20"
        >
          <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">首要污染物</div>
          <div class="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ primaryText }}
          </div>
        </div>

        <div
          class="rounded-xl border border-zinc-200/70 bg-white/60 p-3 dark:border-zinc-800/70 dark:bg-zinc-950/20"
        >
          <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">健康影响</div>
          <div class="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
            {{ aqi.health?.effect || '—' }}
          </div>
        </div>

        <div
          class="rounded-xl border border-zinc-200/70 bg-white/60 p-3 dark:border-zinc-800/70 dark:bg-zinc-950/20"
        >
          <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">建议</div>
          <div class="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <div>
              <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">一般人群</div>
              <div class="mt-0.5 leading-relaxed">
                {{ aqi.health?.advice?.generalPopulation || '—' }}
              </div>
            </div>
            <div>
              <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">敏感人群</div>
              <div class="mt-0.5 leading-relaxed">
                {{ aqi.health?.advice?.sensitivePopulation || '—' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- right: pollutants chips -->
      <div
        class="rounded-xl border border-zinc-200/70 bg-white/60 p-3 dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">污染物浓度</div>
          <div class="text-xs text-zinc-500 dark:text-zinc-400">单位见右侧</div>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2">
          <div
            v-for="p in pickedPollutants"
            :key="p.code"
            class="rounded-xl border border-zinc-200/70 bg-white/70 px-3 py-2 dark:border-zinc-800/70 dark:bg-zinc-900/40"
          >
            <div class="text-[11px] text-zinc-500 dark:text-zinc-400">
              {{ shortName(p) }}
            </div>
            <div class="mt-0.5 flex items-baseline justify-between gap-2">
              <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {{ formatValue(p?.concentration?.value) }}
              </div>
              <div class="text-[11px] text-zinc-500 dark:text-zinc-400">
                {{ p?.concentration?.unit || '' }}
              </div>
            </div>
          </div>
        </div>

        <!-- stations (optional): keep minimal, scroll if long -->
        <div v-if="stations.length" class="mt-3">
          <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">监测站点（部分）</div>
          <div class="mt-1 max-h-20 overflow-auto pr-1 text-xs text-zinc-600 dark:text-zinc-300">
            {{ stationsText }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-4 text-sm text-zinc-500 dark:text-zinc-400">加载中…</div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { apiGetNowAirQuality } from '@/api/weather.api.js'

const props = defineProps({
  locationCode: { type: String, required: true },
})

const result = ref(null)

async function loadWeather() {
  result.value = await apiGetNowAirQuality({
    location: props.locationCode,
  })
}

watch(
  () => props.locationCode,
  () => loadWeather(),
  { immediate: true },
)

const data = computed(() => result.value?.data || null)
const aqi = computed(() => (data.value?.indexes && data.value.indexes[0]) || null)
const pollutants = computed(() => data.value?.pollutants || [])
const stations = computed(() => data.value?.stations || [])

const stationsText = computed(() =>
  stations.value
    .slice(0, 8)
    .map((s) => s.name)
    .filter(Boolean)
    .join('、'),
)

// 选常用污染物，按固定顺序
const pickedPollutants = computed(() => {
  const order = ['pm2p5', 'pm10', 'no2', 'o3', 'so2', 'co']
  const map = new Map(pollutants.value.map((p) => [p.code, p]))
  return order.map((k) => map.get(k)).filter(Boolean)
})

const primaryText = computed(() => {
  const p = aqi.value?.primaryPollutant
  if (!p) return '—'
  return p.name || p.fullName || p.code || '—'
})

const aqiBadgeStyle = computed(() => {
  const c = aqi.value?.color
  if (!c) return {}
  const bg = `rgba(${c.red}, ${c.green}, ${c.blue}, 1)`
  const bd = `rgba(${c.red}, ${c.green}, ${c.blue}, 1)`
  const text = pickTextColor(c)
  return { backgroundColor: bg, borderColor: bd, color: text }
})

function pickTextColor(c) {
  const r = Number(c?.red ?? 0)
  const g = Number(c?.green ?? 0)
  const b = Number(c?.blue ?? 0)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 160 ? '#3f3f46' : '#ffffff'
}

function shortName(p) {
  // 更紧凑的展示
  const code = (p?.code || '').toLowerCase()
  if (code === 'pm2p5') return 'PM2.5'
  if (code === 'pm10') return 'PM10'
  return (p?.name || p?.code || '').toUpperCase()
}

function formatValue(v) {
  if (v === undefined || v === null || v === '') return '—'
  const n = Number(v)
  if (Number.isNaN(n)) return '—'
  // μg/m³ 大多整数；CO mg/m³ 可能小数
  return n >= 10 ? n.toFixed(0) : n.toFixed(2)
}
</script>
