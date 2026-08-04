<template>
  <div
    class="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/50"
  >
    <!-- header -->
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">生活指数</div>
        <div class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {{ subtitle || '—' }}
        </div>
      </div>

      <span
        v-if="items.length"
        class="rounded-full border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950/20 dark:text-zinc-300"
      >
        今日 {{ items.length }} 项
      </span>
    </div>

    <!-- list (scroll, no expand button) -->
    <div
      class="mt-3 max-h-[360px] space-y-2 overflow-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(161,161,170,.6)_transparent] dark:[scrollbar-color:rgba(113,113,122,.65)_transparent]"
    >
      <div
        v-for="x in items"
        :key="x.type"
        class="rounded-xl border border-zinc-200/70 bg-white/60 px-3 py-3 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ x.name }}
            </div>
            <div class="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
              {{ x.text || '—' }}
            </div>
          </div>

          <span
            class="shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium"
            :class="badgeClass(x)"
            :title="`等级 ${x.level}`"
          >
            {{ x.category }}
          </span>
        </div>

        <!-- small tags -->
        <div class="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-300">
          <span
            class="rounded-full border border-zinc-200/70 bg-white/50 px-2 py-0.5 dark:border-zinc-800/70 dark:bg-zinc-950/10"
          >
            等级 {{ x.level }}
          </span>
          <span
            class="rounded-full border border-zinc-200/70 bg-white/50 px-2 py-0.5 dark:border-zinc-800/70 dark:bg-zinc-950/10"
          >
            类型 {{ x.type }}
          </span>
        </div>
      </div>

      <div v-if="!items.length" class="py-6 text-sm text-zinc-500 dark:text-zinc-400">加载中…</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { apiGetWeatherIndexForecast } from '@/api/weather.api.js'

const props = defineProps({
  locationCode: { type: String, required: true },
})

const result = ref(null)

async function loadWeather() {
  result.value = await apiGetWeatherIndexForecast({
    location: props.locationCode,
  })
}

watch(
  () => props.locationCode,
  () => loadWeather(),
  { immediate: true },
)

const daily = computed(() => result.value?.data?.daily || [])

// 按今天过滤（接口返回同一天的多项）
const items = computed(() => {
  if (!daily.value.length) return []
  const day = daily.value[0]?.date
  return daily.value.filter((x) => x.date === day)
})

const subtitle = computed(() => {
  if (!items.value.length) return ''
  const d = items.value[0]?.date
  if (!d) return ''
  const [, m, dd] = d.split('-')
  return `${m}/${dd} 指数建议`
})

function badgeClass(x) {
  // 按 level 粗分，保持干净不乱
  const lv = Number(x?.level ?? 0)

  // 1-2：更适宜（偏绿）
  if (lv <= 2) {
    return (
      'border-emerald-200/70 bg-emerald-50 text-emerald-700 ' +
      'dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
    )
  }

  // 3：一般/较不宜（偏琥珀）
  if (lv === 3) {
    return (
      'border-amber-200/70 bg-amber-50 text-amber-800 ' +
      'dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200'
    )
  }

  // 4-5：不宜（偏红）
  return (
    'border-rose-200/70 bg-rose-50 text-rose-700 ' +
    'dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200'
  )
}
</script>
