<template>
  <!-- KPI cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div
      class="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/50 backdrop-blur p-5"
    >
      <div class="text-xs font-bold text-gray-500 dark:text-gray-400">最新价格</div>
      <div class="mt-2 flex items-end justify-between">
        <div class="text-3xl font-black text-gray-900 dark:text-gray-100">
          {{ formatPrice(latestPrice) }}
        </div>
        <Tag :severity="deltaN >= 0 ? 'success' : 'danger'" :value="deltaNText" />
      </div>
      <div class="mt-2 text-xs text-gray-400">监测日期：{{ latestDate || '—' }}</div>
    </div>

    <div
      class="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/50 backdrop-blur p-5"
    >
      <div class="text-xs font-bold text-gray-500 dark:text-gray-400">7 次均价</div>
      <div class="mt-2 text-3xl font-black text-gray-900 dark:text-gray-100">
        {{ formatPrice(avgN) }}
      </div>
      <div class="mt-2 text-xs text-gray-400">计算范围：近 7 条记录</div>
    </div>

    <div
      class="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/50 backdrop-blur p-5"
    >
      <div class="text-xs font-bold text-gray-500 dark:text-gray-400">7 次区间</div>
      <div class="mt-2 flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          低：<span class="font-bold text-gray-900 dark:text-gray-100">{{
            formatPrice(minN)
          }}</span>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-300">
          高：<span class="font-bold text-gray-900 dark:text-gray-100">{{
            formatPrice(maxN)
          }}</span>
        </div>
      </div>
      <div class="mt-3 text-xs text-gray-400">用于判断波动区间</div>
    </div>
  </div>

  <!-- Chart + Table -->
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
    <!-- Chart -->
    <div
      class="lg:col-span-3 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/50 backdrop-blur p-4 md:p-5"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="font-extrabold text-gray-900 dark:text-gray-100">近 7 次趋势</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ province }} · {{ unitLabel }}</div>
      </div>

      <div class="h-[320px]">
        <VChart :option="chartOption" autoresize />
      </div>

      <div class="mt-3 text-[12px] text-gray-400">
      </div>
    </div>

    <!-- Table -->
    <div
      class="lg:col-span-2 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/50 backdrop-blur p-4 md:p-5"
    >
      <div class="font-extrabold text-gray-900 dark:text-gray-100 mb-3">数据明细</div>

      <DataTable
        :value="rows"
        :loading="loading"
        stripedRows
        responsiveLayout="scroll"
        class="text-sm"
      >
        <template #empty>
          <div class="py-10 text-center text-gray-500 dark:text-gray-400">暂无数据</div>
        </template>

        <Column header="日期" field="date" :style="{ minWidth: '8rem' }" />
        <Column header="价格" :style="{ minWidth: '8rem' }">
          <template #body="{ data }">
            <span class="font-bold text-gray-900 dark:text-gray-100">{{
              formatPrice(data.price)
            }}</span>
          </template>
        </Column>
        <Column header="来源" field="source" :style="{ minWidth: '7rem' }" />
      </DataTable>

      <div class="mt-3 text-[12px] text-gray-400">
        说明：这里是“近 7 次记录”，不代表连续 7 天；日期以采集/监测周期为准。
      </div>
    </div>
  </div>
</template>

<script setup>
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import VChart from 'vue-echarts'

defineProps({
  province: { type: String, required: true },
  unitLabel: { type: String, required: true },
  loading: { type: Boolean, default: false },

  rows: { type: Array, required: true }, // 最新在前（表格）
  chartOption: { type: Object, required: true },

  latestPrice: { type: [Number, null], default: null },
  latestDate: { type: String, default: '' },
  avgN: { type: [Number, null], default: null },
  minN: { type: [Number, null], default: null },
  maxN: { type: [Number, null], default: null },
  deltaN: { type: Number, default: 0 },
  deltaNText: { type: String, default: '' },

  formatPrice: { type: Function, required: true },
})
</script>

<style scoped>
:deep(.echarts) {
  border-radius: 16px;
}
</style>
