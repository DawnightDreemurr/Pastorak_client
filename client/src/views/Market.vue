<template>
  <div>
    <div class="min-h-[calc(100vh-64px)] p-4 md:p-6 space-y-4 md:space-y-6">
      <MarketToolbar
        v-model:province="province"
        v-model:unit="unit"
        :provinceOptions="provinceOptions"
        :unitOptions="unitOptions"
      />

      <MarketPanel
        :province="province"
        :unitLabel="unitLabel"
        :loading="loading"
        :rows="rows"
        :chartOption="chartOption"
        :latestPrice="latestPrice"
        :latestDate="latestDate"
        :avgN="avgN"
        :minN="minN"
        :maxN="maxN"
        :deltaN="deltaN"
        :deltaNText="deltaNText"
        :formatPrice="formatPrice"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([LineChart, TooltipComponent, GridComponent, CanvasRenderer])

import MarketToolbar from '@/components/market/MarketToolbar.vue'
import MarketPanel from '@/components/market/MarketPanel.vue'

import { apiGetCornPriceSeries, CORN_PRICE_REGIONS } from '@/api/cornPrice.api'

const loading = ref(false)

const provinceOptions = CORN_PRICE_REGIONS.map((r) => ({ label: r, value: r }))
const province = ref('吉林')

// 单位切换（仅展示换算）
const unitOptions = [
  { label: '元/吨', value: 'ton' },
  { label: '元/斤', value: 'jin' },
]
const unit = ref('ton')
const unitLabel = computed(() => (unit.value === 'ton' ? '元/吨' : '元/斤'))

/**
 * rawRows: 最新在前（用于 KPI / 表格）
 * { date, priceTon, source }
 */
const rawRows = ref([])

function normalizeResponse(res) {
  // 兼容 axios response 或 request 直接返回 data
  if (res && typeof res === 'object' && 'data' in res && res.data && 'success' in res.data)
    return res.data
  return res
}

function toDisplayPrice(priceTon) {
  if (priceTon == null) return null
  if (unit.value === 'ton') return priceTon
  return Number((priceTon / 2000).toFixed(4))
}

const rows = computed(() =>
  rawRows.value.map((r) => ({
    date: r.date,
    price: toDisplayPrice(r.priceTon),
    source: r.source || '—',
  })),
)

// KPI：最新价格 = rawRows[0]
const latestPrice = computed(() => rows.value[0]?.price ?? null)
const latestDate = computed(() => rows.value[0]?.date ?? '')

const prices = computed(() => rows.value.map((r) => r.price).filter((v) => typeof v === 'number'))
const avgN = computed(() => {
  if (!prices.value.length) return null
  const sum = prices.value.reduce((a, b) => a + b, 0)
  return Number((sum / prices.value.length).toFixed(4))
})
const minN = computed(() => (prices.value.length ? Math.min(...prices.value) : null))
const maxN = computed(() => (prices.value.length ? Math.max(...prices.value) : null))

// 7次变化：最新 - 最早（rawRows 是倒序，所以最早在最后）
const deltaN = computed(() => {
  if (rows.value.length < 2) return 0
  const newest = rows.value[0]?.price
  const oldest = rows.value[rows.value.length - 1]?.price
  if (newest == null || oldest == null) return 0
  return Number((newest - oldest).toFixed(4))
})
const deltaNText = computed(() =>
  deltaN.value >= 0 ? `+${formatPrice(deltaN.value)}` : formatPrice(deltaN.value),
)

function formatPrice(v) {
  if (v == null) return '—'
  const suffix = unit.value === 'ton' ? ' 元/吨' : ' 元/斤'
  if (unit.value === 'ton') return `${Math.round(v)}${suffix}`
  return `${Number(v).toFixed(3)}${suffix}`
}

/** 图表：从旧到新更顺（所以用升序） */
const chartOption = computed(() => {
  // rawRows 是最新在前，图表需要反过来
  const asc = rawRows.value.slice().reverse()

  const x = asc.map((r) => r.date)
  const y = asc.map((r) => toDisplayPrice(r.priceTon))

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
    grid: { left: 36, right: 18, top: 24, bottom: 28, containLabel: true },
    xAxis: {
      type: 'category',
      data: x,
      axisLabel: { color: 'rgba(148,163,184,1)' },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: 'rgba(148,163,184,1)' },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { show: false },
    },
    series: [
      {
        type: 'line',
        data: y,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.12 },
      },
    ],
  }
})

async function loadSeries() {
  loading.value = true
  try {
    const res = await apiGetCornPriceSeries(province.value) // 默认7次
    const data = normalizeResponse(res)

    const list = data?.data?.series || []

    // 后端 list 是升序：旧→新
    // 前端 rawRows 需要最新在前
    rawRows.value = list
      .map((it) => ({
        date: it.date,
        priceTon: Number(it.priceYuanPerTon),
        source: '国家粮食和物资储备局',
      }))
      .filter((x) => x.date && !Number.isNaN(x.priceTon))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch {
    // 按你的要求：报错就当没数据
    rawRows.value = []
  } finally {
    loading.value = false
  }
}

// 省份切换瞬间请求
watch(province, () => loadSeries())

onMounted(() => loadSeries())
</script>
