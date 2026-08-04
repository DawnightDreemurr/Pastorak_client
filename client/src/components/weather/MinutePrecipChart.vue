<template>
  <div
    class="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/50"
  >
    <!-- header -->
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">分钟级降水</div>
        <div class="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-300">
          {{ summary || '—' }}
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <span
          v-if="kindBadge"
          class="rounded-full border px-2 py-0.5 text-xs font-medium"
          :class="kindBadge.class"
        >
          {{ kindBadge.text }}
        </span>

        <span
          v-if="stats"
          class="rounded-full border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950/20 dark:text-zinc-300"
          title="未来两小时累计降水"
        >
          累计 {{ stats.sum }} mm
        </span>
      </div>
    </div>

    <!-- chart -->
    <div
      class="mt-3 rounded-xl border border-zinc-200/70 bg-white/50 p-2 dark:border-zinc-800/70 dark:bg-zinc-950/20"
    >
      <div ref="chartEl" class="h-56 w-full sm:h-64"></div>
    </div>

    <!-- footer micro stats -->
    <div v-if="stats" class="mt-3 grid grid-cols-3 gap-2">
      <div
        class="rounded-xl border border-zinc-200/70 bg-white/50 px-3 py-2 text-xs dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <div class="text-zinc-500 dark:text-zinc-400">峰值</div>
        <div class="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {{ stats.max }} mm
        </div>
      </div>

      <div
        class="rounded-xl border border-zinc-200/70 bg-white/50 px-3 py-2 text-xs dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <div class="text-zinc-500 dark:text-zinc-400">开始</div>
        <div class="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {{ stats.start }}
        </div>
      </div>

      <div
        class="rounded-xl border border-zinc-200/70 bg-white/50 px-3 py-2 text-xs dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <div class="text-zinc-500 dark:text-zinc-400">结束</div>
        <div class="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {{ stats.end }}
        </div>
      </div>
    </div>

    <div v-else class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">加载中…</div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { apiGetMinutePrecipitation } from '@/api/weather.api.js'

const props = defineProps({
  locationCode: { type: String, required: true },
})

const result = ref(null)

async function loadWeather() {
  result.value = await apiGetMinutePrecipitation({
    location: props.locationCode,
  })
}

watch(
  () => props.locationCode,
  () => loadWeather(),
  { immediate: true },
)

const data = computed(() => result.value?.data || null)
const summary = computed(() => data.value?.summary || '')

const points = computed(() => {
  const arr = data.value?.minutely || []
  return arr.map((x) => ({
    time: x.fxTime,
    hm: formatHm(x.fxTime),
    v: Number(x.precip ?? 0),
    type: x.type || 'rain',
  }))
})

const stats = computed(() => {
  if (!points.value.length) return null
  const vs = points.value.map((p) => p.v)
  const sum = vs.reduce((a, b) => a + b, 0)
  const max = Math.max(...vs)
  return {
    sum: sum.toFixed(2),
    max: max.toFixed(2),
    start: points.value[0].hm,
    end: points.value[points.value.length - 1].hm,
  }
})

const kindBadge = computed(() => {
  if (!points.value.length) return null
  // 如果未来两小时全部 0，就给“无降水”
  const hasAny = points.value.some((p) => p.v > 0)
  if (!hasAny) {
    return {
      text: '无降水',
      class:
        'border-emerald-200/70 bg-emerald-50 text-emerald-700 ' +
        'dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200',
    }
  }

  // 根据 type 判雨/雪（混合则显示“雨/雪”）
  const types = new Set(points.value.filter((p) => p.v > 0).map((p) => p.type))
  const t = [...types]
  const text = t.length > 1 ? '雨/雪' : t[0] === 'snow' ? '降雪' : '降雨'

  // 用更酷一点的 badge：雨偏蓝绿，雪偏青紫
  if (text === '降雪') {
    return {
      text,
      class:
        'border-sky-200/70 bg-sky-50 text-sky-700 ' +
        'dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200',
    }
  }
  if (text === '降雨') {
    return {
      text,
      class:
        'border-teal-200/70 bg-teal-50 text-teal-700 ' +
        'dark:border-teal-900/60 dark:bg-teal-950/30 dark:text-teal-200',
    }
  }
  return {
    text,
    class:
      'border-indigo-200/70 bg-indigo-50 text-indigo-700 ' +
      'dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-200',
  }
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

  const axisText = dark ? 'rgba(228,228,231,0.78)' : 'rgba(63,63,70,0.78)'
  const gridLine = dark ? 'rgba(113,113,122,0.22)' : 'rgba(24,24,27,0.10)'
  const tooltipBg = dark ? 'rgba(24,24,27,0.92)' : 'rgba(255,255,255,0.96)'
  const tooltipText = dark ? 'rgba(244,244,245,0.92)' : 'rgba(24,24,27,0.92)'

  const x = points.value.map((p) => p.hm)
  const y = points.value.map((p) => p.v)

  const maxV = y.length ? Math.max(...y) : 0
  // y 轴上限稍微抬一点，避免贴顶
  const yMax = maxV > 0 ? +(maxV * 1.35).toFixed(2) : 1

  // “酷一点”：渐变面积 + 顶部高光线 + 微弱发光
  const lineColor = dark ? 'rgba(94,234,212,1)' : 'rgba(13,148,136,1)' // teal
  const glowColor = dark ? 'rgba(94,234,212,0.35)' : 'rgba(13,148,136,0.25)'
  const areaTop = dark ? 'rgba(94,234,212,0.38)' : 'rgba(16,185,129,0.22)'
  const areaBottom = dark ? 'rgba(94,234,212,0.05)' : 'rgba(16,185,129,0.03)'

  const barColor = dark ? 'rgba(147,197,253,0.55)' : 'rgba(59,130,246,0.35)' // sky/blue

  return {
    animation: true,
    animationDuration: 700,
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
        const p = params?.find((x) => x.seriesName === '降水') || params?.[0]
        if (!p) return ''
        return `${p.axisValue}<br/>降水：<b>${Number(p.data).toFixed(2)}</b> mm`
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
        interval: (idx) => idx % 3 !== 0, // 5min间隔太密，显示每 15 分钟
      },
    },

    yAxis: {
      type: 'value',
      min: 0,
      max: yMax,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: gridLine } },
      axisLabel: { color: axisText, fontSize: 11 },
    },

    series: [
      // 1) 轻量柱：增强“雨点感”，0 也能看出时间轴
      {
        name: '降水柱',
        type: 'bar',
        data: y,
        barWidth: 6,
        itemStyle: {
          color: barColor,
          borderRadius: [6, 6, 0, 0],
        },
        emphasis: { disabled: true },
        z: 1,
      },

      // 2) 主线+面积
      {
        name: '降水',
        type: 'line',
        smooth: true,
        data: y,
        symbol: 'circle',
        symbolSize: (val) => (val > 0 ? 6 : 0),
        lineStyle: {
          width: 2,
          color: lineColor,
          shadowBlur: 18,
          shadowColor: glowColor,
        },
        itemStyle: { color: lineColor },
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

  // 容器尺寸变化 -> resize
  ro = new ResizeObserver(() => {
    if (chart) chart.resize()
  })
  if (chartEl.value) ro.observe(chartEl.value)

  // 主题 class 变化 -> 重新渲染配色
  mo = new MutationObserver(() => {
    renderChart()
  })
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

watch(points, () => {
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
