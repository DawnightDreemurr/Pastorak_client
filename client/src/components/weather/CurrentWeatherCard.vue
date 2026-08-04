<template>
  <div
    class="relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/50"
  >
    <!-- subtle background glow -->
    <div
      class="pointer-events-none absolute -top-28 -right-28 h-64 w-64 rounded-full blur-3xl"
      :class="isDark ? 'bg-emerald-500/12' : 'bg-emerald-400/18'"
    />
    <div
      class="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full blur-3xl"
      :class="isDark ? 'bg-amber-500/10' : 'bg-amber-400/14'"
    />

    <!-- header: location + obs time -->
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <div class="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {{ displayLocation }}
          </div>

          <span
            v-if="now?.text"
            class="rounded-full border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800/70 dark:bg-zinc-950/20 dark:text-zinc-200"
          >
            {{ now.text }}
          </span>
        </div>

        <div class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {{ secondaryLine }}
        </div>
      </div>

      <div
        class="shrink-0 rounded-full border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950/20 dark:text-zinc-300"
        title="观测时间"
      >
        {{ obsTimeHm || '—' }}
      </div>
    </div>

    <!-- hero -->
    <div class="mt-4 flex items-center gap-4">
      <!-- icon -->
      <div
        class="relative grid h-16 w-16 place-items-center rounded-2xl border border-zinc-200/70 bg-white/70 dark:border-zinc-800/70 dark:bg-zinc-950/20"
        title="天气图标"
      >
        <i :class="iconClass" class="text-4xl text-zinc-900 dark:text-zinc-100"></i>
        <span
          class="pointer-events-none absolute inset-0 rounded-2xl blur-xl opacity-80"
          :class="isDark ? 'bg-emerald-500/12' : 'bg-emerald-400/18'"
        />
      </div>

      <!-- big temp -->
      <div class="min-w-0 flex-1">
        <div class="flex items-end gap-3">
          <div class="text-6xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {{ tempBig }}
          </div>
          <div class="pb-2 text-sm text-zinc-600 dark:text-zinc-300">
            体感
            <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ feelsLikeText }}</span>
          </div>
        </div>

        <div class="mt-2 flex flex-wrap gap-2 text-xs">
          <span
            class="rounded-full border border-emerald-200/70 bg-emerald-50/70 px-2 py-0.5 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200"
          >
            湿度 {{ humidityText }}
          </span>

          <span
            class="rounded-full border border-amber-200/70 bg-amber-50/70 px-2 py-0.5 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
          >
            风 {{ windScaleText }}级 · {{ windSpeedText }}
          </span>

          <span
            class="rounded-full border border-zinc-200/70 bg-white/60 px-2 py-0.5 text-zinc-700 dark:border-zinc-800/70 dark:bg-zinc-950/20 dark:text-zinc-200"
          >
            能见度 {{ visText }}
          </span>
        </div>
      </div>
    </div>

    <!-- key metrics: compact grid -->
    <div class="mt-6 grid grid-cols-3 gap-x-4 gap-y-3">
      <div
        class="flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white/60 px-3 py-3 dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <span class="text-lg">🌧</span>
        <div>
          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">降水</div>
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{{ precipText }}</div>
        </div>
      </div>

      <div
        class="flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white/60 px-3 py-3 dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <span class="text-lg">☁</span>
        <div>
          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">云量</div>
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{{ cloudText }}</div>
        </div>
      </div>

      <div
        class="flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white/60 px-3 py-3 dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <span class="text-lg">📈</span>
        <div>
          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">气压</div>
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ pressureText }}
          </div>
        </div>
      </div>

      <div
        class="flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white/60 px-3 py-3 dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <span class="text-lg">🌡</span>
        <div>
          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">露点</div>
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{{ dewText }}</div>
        </div>
      </div>

      <div
        class="flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white/60 px-3 py-3 dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <span class="text-lg">🧭</span>
        <div>
          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">风向</div>
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ windDirText }}
          </div>
        </div>
      </div>

      <div
        class="flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white/60 px-3 py-3 dark:border-zinc-800/70 dark:bg-zinc-950/20"
      >
        <span class="text-lg">💧</span>
        <div>
          <div class="text-[11px] text-zinc-500 dark:text-zinc-400">湿度</div>
          <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ humidityText }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!now" class="mt-4 text-sm text-zinc-500 dark:text-zinc-400">加载中…</div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { apiGetWeatherNow } from '@/api/weather.api.js'

const props = defineProps({
  locationCode: { type: String, required: true },
  // 从 Weather.vue 传入；没传则默认 吉林·长春
  locationName: { type: String, default: '吉林·长春' },
})

const result = ref(null)

async function loadWeather() {
  result.value = await apiGetWeatherNow({ location: props.locationCode })
}

watch(
  () => props.locationCode,
  () => loadWeather(),
  { immediate: true },
)

const now = computed(() => result.value?.data?.now || null)
const isDark = computed(() => document.documentElement.classList.contains('dark'))

const displayLocation = computed(() => props.locationName || '吉林·长春')

const iconClass = computed(() => `qi-${now.value?.icon || '999'}`)

const tempBig = computed(() => (now.value?.temp != null ? `${now.value.temp}°` : '—'))
const feelsLikeText = computed(() =>
  now.value?.feelsLike != null ? `${now.value.feelsLike}°` : '—',
)

const humidityText = computed(() => (now.value?.humidity != null ? `${now.value.humidity}%` : '—'))
const visText = computed(() => (now.value?.vis != null ? `${now.value.vis} km` : '—'))
const pressureText = computed(() =>
  now.value?.pressure != null ? `${now.value.pressure} hPa` : '—',
)
const dewText = computed(() => (now.value?.dew != null ? `${now.value.dew}°` : '—'))

const windDirText = computed(() => now.value?.windDir || '—')
const windScaleText = computed(() => (now.value?.windScale != null ? now.value.windScale : '—'))
const windSpeedText = computed(() =>
  now.value?.windSpeed != null ? `${now.value.windSpeed} km/h` : '—',
)

const precipText = computed(() =>
  now.value?.precip != null ? `${Number(now.value.precip).toFixed(1)} mm` : '—',
)
const cloudText = computed(() => (now.value?.cloud != null ? `${now.value.cloud}%` : '—'))

const obsTimeHm = computed(() => {
  const t = now.value?.obsTime
  if (!t) return ''
  try {
    const d = new Date(t)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  } catch {
    return ''
  }
})

// 第二行：把“关键但不占空间”的信息压成一行
const secondaryLine = computed(() => {
  if (!now.value) return '—'
  const wind = windDirText.value !== '—' ? `${windDirText.value} ${windScaleText.value}级` : '—'
  const hum = humidityText.value !== '—' ? `湿度 ${humidityText.value}` : '—'
  return `${wind} · ${hum}`
})
</script>
