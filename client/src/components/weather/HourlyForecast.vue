<template>
  <div
    class="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/50"
  >
    <!-- header -->
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">小时预报</div>
        <div class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          <span v-if="summary">{{ summary }}</span>
          <span v-else>—</span>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <span
          v-if="peakPop !== null"
          class="rounded-full border border-sky-200/70 bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200"
          title="最高降水概率"
        >
          POP {{ peakPop }}%
        </span>

        <span
          v-if="maxWind !== null"
          class="rounded-full border border-emerald-200/70 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200"
          title="最大风速"
        >
          风 {{ maxWind }} km/h
        </span>
      </div>
    </div>

    <!-- chart -->
    <div
      class="mt-3 rounded-xl border border-zinc-200/70 bg-white/50 p-2 dark:border-zinc-800/70 dark:bg-zinc-950/20"
    >
      <div ref="chartEl" class="h-56 w-full sm:h-64"></div>
    </div>

    <!-- scroller -->
    <div class="mt-3 -mx-4 overflow-x-auto px-4">
      <div class="flex gap-2 pb-1">
        <div
          v-for="h in shown"
          :key="h.fxTime"
          class="w-[150px] shrink-0 rounded-xl border border-zinc-200/70 bg-white/60 p-3 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/20"
        >
          <div class="flex items-center justify-between">
            <div class="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              {{ formatHm(h.fxTime) }}
            </div>

            <div
              v-if="Number(h.pop) > 0"
              class="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-800 dark:bg-sky-900/40 dark:text-sky-200"
              title="降水概率"
            >
              {{ h.pop }}%
            </div>
          </div>

          <div class="mt-2 flex items-center gap-2">
            <div
              class="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200/70 bg-white/70 dark:border-zinc-800/70 dark:bg-zinc-900/40"
              title="天气"
            >
              <i :class="`qi-${h.icon}`" class="text-xl text-zinc-800 dark:text-zinc-100"></i>
            </div>

            <div class="min-w-0">
              <div class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {{ h.temp }}°
              </div>
              <div class="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {{ h.text }}
              </div>
            </div>
          </div>

          <div class="mt-3 space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
            <div class="flex items-center justify-between gap-2">
              <span class="text-zinc-500 dark:text-zinc-400">风</span>
              <span class="truncate font-medium">{{ h.windScale }}级</span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="text-zinc-500 dark:text-zinc-400">湿度</span>
              <span class="font-medium">{{ h.humidity }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!hourly.length" class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">加载中…</div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { apiGetHourlyWeather } from '@/api/weather.api.js'

const props = defineProps({
  locationCode: { type: String, required: true },
})

const result = ref(null)

async function loadWeather() {
  result.value = await apiGetHourlyWeather({
    location: props.locationCode,
  })
}

watch(
  () => props.locationCode,
  () => loadWeather(),
  { immediate: true },
)

const hourly = computed(() => result.value?.data?.hourly || [])

// 不要“展开”按钮：固定展示前 18 小时（够密、也不会太长）
const shown = computed(() => hourly.value.slice(0, 18))

const temps = computed(() => shown.value.map((h) => Number(h.temp)))
const minTemp = computed(() => (temps.value.length ? Math.min(...temps.value) : null))
const maxTemp = computed(() => (temps.value.length ? Math.max(...temps.value) : null))

const peakPop = computed(() => {
  if (!shown.value.length) return null
  const pops = shown.value.map((h) => Number(h.pop ?? 0))
  return pops.length ? Math.max(...pops) : null
})

const maxWind = computed(() => {
  if (!shown.value.length) return null
  const ws = shown.value.map((h) => Number(h.windSpeed ?? 0))
  return ws.length ? Math.max(...ws) : null
})

const summary = computed(() => {
  if (minTemp.value === null || maxTemp.value === null) return ''
  const start = formatHm(shown.value[0]?.fxTime)
  const end = formatHm(shown.value[shown.value.length - 1]?.fxTime)
  return `${start}–${end}  温度 ${minTemp.value}° ~ ${maxTemp.value}°`
})

/** -----------------------------
 * ECharts
 * ----------------------------- */
const chartEl = ref(null)
let chart = null
let ro = null
let mo = null

function isDark() {
  return document.documentElement.classList.contains('dark')
}

function makeOption() {
  const dark = isDark()

  const axisText = dark ? 'rgba(228,228,231,0.80)' : 'rgba(63,63,70,0.78)'
  const gridLine = dark ? 'rgba(113,113,122,0.22)' : 'rgba(24,24,27,0.10)'
  const tooltipBg = dark ? 'rgba(24,24,27,0.92)' : 'rgba(255,255,255,0.96)'
  const tooltipText = dark ? 'rgba(244,244,245,0.92)' : 'rgba(24,24,27,0.92)'

  const x = shown.value.map((h) => formatHm(h.fxTime))
  const y = shown.value.map((h) => Number(h.temp))

  const tMin = y.length ? Math.min(...y) : 0
  const tMax = y.length ? Math.max(...y) : 0
  const pad = Math.max(2, Math.ceil((tMax - tMin) * 0.35))
  const yMin = tMin - pad
  const yMax = tMax + pad

  // “酷一点”：温度线用暖色渐变（白天）、暗色模式用更霓虹的橙金
  const lineColor = dark ? 'rgba(251,191,36,1)' : 'rgba(245,158,11,1)' // amber
  const glowColor = dark ? 'rgba(251,191,36,0.35)' : 'rgba(245,158,11,0.22)'
  const areaTop = dark ? 'rgba(251,191,36,0.28)' : 'rgba(245,158,11,0.16)'
  const areaBottom = dark ? 'rgba(251,191,36,0.04)' : 'rgba(245,158,11,0.02)'

  return {
    animation: true,
    animationDuration: 750,
    animationEasing: 'cubicOut',
    grid: { left: 44, right: 14, top: 18, bottom: 30 },

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: { color: gridLine },
      },
      backgroundColor: tooltipBg,
      borderWidth: 0,
      textStyle: { color: tooltipText },
      formatter: (params) => {
        const p = params?.[0]
        if (!p) return ''
        const idx = p.dataIndex
        const h = shown.value[idx]
        const pop = Number(h?.pop ?? 0)
        const wind = h?.windScale ? `${h.windScale}级` : '—'
        return [
          `${p.axisValue}`,
          `温度：<b>${p.data}°</b>`,
          `天气：${h?.text || '—'}`,
          `降水概率：${pop}%`,
          `风：${wind}`,
          `湿度：${h?.humidity ?? '—'}%`,
        ].join('<br/>')
      },
    },

    xAxis: {
      type: 'category',
      data: x,
      boundaryGap: true,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: gridLine } },
      axisLabel: {
        color: axisText,
        fontSize: 11,
        interval: (idx) => idx % 2 !== 0, // 每 2 小时显示一次
      },
    },

    yAxis: {
      type: 'value',
      min: yMin,
      max: yMax,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: gridLine } },
      axisLabel: { color: axisText, fontSize: 11 },
    },

    series: [
      {
        name: '温度',
        type: 'line',
        smooth: true,
        data: y,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: {
          width: 2.5,
          color: lineColor,
          shadowBlur: 18,
          shadowColor: glowColor,
        },
        itemStyle: { color: lineColor },
        label: {
          show: true,
          formatter: '{c}°',
          color: axisText,
          fontSize: 11,
          position: 'top',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: areaTop },
            { offset: 1, color: areaBottom },
          ]),
        },
        z: 2,
      },
    ],
  }
}

async function renderChart() {
  if (!chartEl.value) return
  await nextTick()

  if (!chart) {
    chart = echarts.init(chartEl.value, null, { renderer: 'canvas' })
  }

  chart.setOption(makeOption(), true)
  chart.resize()
}

onMounted(() => {
  renderChart()

  ro = new ResizeObserver(() => {
    if (chart) chart.resize()
  })
  if (chartEl.value) ro.observe(chartEl.value)

  mo = new MutationObserver(() => {
    renderChart()
  })
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

watch(shown, () => {
  renderChart()
})

onBeforeUnmount(() => {
  if (ro && chartEl.value) ro.unobserve(chartEl.value)
  ro = null

  if (mo) mo.disconnect()
  mo = null

  if (chart) {
    chart.dispose()
    chart = null
  }
})

function formatHm(isoLike) {
  try {
    const d = new Date(isoLike)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  } catch {
    return ''
  }
}
</script>
