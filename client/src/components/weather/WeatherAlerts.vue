<template>
  <div v-if="hasAlerts" class="space-y-2">
    <!-- Alerts banners -->
    <div
      v-for="a in alerts"
      :key="a.id"
      class="group relative overflow-hidden rounded-xl border px-4 py-2 shadow-sm backdrop-blur dark:shadow-none"
      :style="bannerStyle(a)"
    >
      <!-- subtle left glow -->
      <div
        class="pointer-events-none absolute inset-y-0 left-0 w-1.5"
        :style="{ backgroundColor: rgba(a.color, 0.95) }"
      />

      <div class="flex items-center gap-3">
        <!-- icon -->
        <div
          class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/30 bg-white/20 dark:border-white/10 dark:bg-white/5"
          :title="a.eventType?.name || '预警'"
        >
          <i
            :class="`qi-${a.icon || a.eventType?.code || '9999'}`"
            class="text-xl text-zinc-900 dark:text-zinc-100"
          ></i>
        </div>

        <!-- main text -->
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <div class="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ a.headline || (a.eventType?.name ? `${a.eventType.name}预警` : '预警') }}
            </div>

            <!-- severity chip -->
            <span
              class="rounded-full border px-2 py-0.5 text-[11px] font-medium"
              :style="chipStyle(a)"
              :title="a.severity || a.color?.code || ''"
            >
              {{ levelText(a) }}
            </span>

            <span
              v-if="a.expireTime"
              class="rounded-full border border-white/30 bg-white/15 px-2 py-0.5 text-[11px] text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
              title="失效时间"
            >
              至 {{ formatHm(a.expireTime) }}
            </span>

            <span
              v-if="a.senderName"
              class="truncate text-[11px] text-zinc-700/90 dark:text-zinc-200/80"
              title="发布机构"
            >
              {{ a.senderName }}
            </span>
          </div>

          <!-- marquee description (only if long) -->
          <div class="mt-1">
            <div v-if="shouldMarquee(a)" class="marquee-wrap">
              <div class="marquee-track text-xs text-zinc-800/90 dark:text-zinc-200/90">
                <div class="marquee-content">
                  <span>{{ compactDesc(a) }}</span>
                  <span class="mx-6 opacity-50">•</span>
                </div>
                <div class="marquee-content" aria-hidden="true">
                  <span>{{ compactDesc(a) }}</span>
                  <span class="mx-6 opacity-50">•</span>
                </div>
              </div>
            </div>

            <div
              v-else
              class="line-clamp-1 text-xs text-zinc-800/90 dark:text-zinc-200/90"
              :title="compactDesc(a)"
            >
              {{ compactDesc(a) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Required: attributions -->
    <div
      v-if="attributions.length"
      class="rounded-xl border border-zinc-200/70 bg-white/60 px-3 py-2 text-[11px] text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950/20 dark:text-zinc-300"
    >
      <div class="font-medium text-zinc-700 dark:text-zinc-200">数据来源 / 声明</div>
      <ul class="mt-1 list-disc space-y-0.5 pl-5">
        <li v-for="(t, i) in attributions" :key="i">{{ t }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { apiGetWeatherAlert } from '@/api/weather.api.js'

const props = defineProps({
  locationCode: { type: String, required: true },
})

const result = ref(null)

async function loadWeather() {
  result.value = await apiGetWeatherAlert({ location: props.locationCode })
}

watch(
  () => props.locationCode,
  () => loadWeather(),
  { immediate: true },
)

const data = computed(() => result.value?.data || null)
const meta = computed(() => data.value?.metadata || {})
const alerts = computed(() => data.value?.alerts || [])
const attributions = computed(() => meta.value?.attributions || [])
const zeroResult = computed(() => Boolean(meta.value?.zeroResult))

const hasAlerts = computed(() => !zeroResult.value && alerts.value.length > 0)

function rgba(colorObj, alphaOverride) {
  if (!colorObj) return `rgba(239,68,68,${alphaOverride ?? 1})`
  const a = alphaOverride ?? colorObj.alpha ?? 1
  return `rgba(${colorObj.red}, ${colorObj.green}, ${colorObj.blue}, ${a})`
}

function bannerStyle(a) {
  const c = a.color
  // banner 背景用预警色的淡色版本，文字保持黑/白自动适配
  const bg = rgba(c, 0.14)
  const bd = rgba(c, 0.45)
  return {
    backgroundColor: bg,
    borderColor: bd,
  }
}

function chipStyle(a) {
  const c = a.color
  const dark = document.documentElement.classList.contains('dark')
  const bg = rgba(c, dark ? 0.28 : 0.22)
  const bd = rgba(c, dark ? 0.55 : 0.45)
  const text = dark ? 'rgba(244,244,245,0.95)' : pickTextColor(c)
  return { backgroundColor: bg, borderColor: bd, color: text }
}

function pickTextColor(c) {
  if (!c) return '#111827'
  const r = Number(c.red ?? 0)
  const g = Number(c.green ?? 0)
  const b = Number(c.blue ?? 0)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 160 ? '#3f3f46' : '#ffffff'
}

function levelText(a) {
  // 优先使用颜色 code（yellow/red/blue...），其次 severity
  const code = a?.color?.code
  if (code) {
    const map = { red: '红色', orange: '橙色', yellow: '黄色', blue: '蓝色' }
    return map[code] ? `${map[code]}预警` : `${code}预警`
  }
  if (a?.severity) return a.severity
  return '预警'
}

function compactDesc(a) {
  // 重要信息：description > criteria（不展示 instruction，不做展开）
  const d = (a?.description || '').replace(/\s+/g, ' ').trim()
  if (d) return d
  const c = (a?.criteria || '').replace(/\s+/g, ' ').trim()
  return c || '—'
}

function shouldMarquee(a) {
  // 字符较长才滚动，短的就一行截断
  const text = compactDesc(a)
  return text.length >= 40
}

function formatHm(isoZ) {
  try {
    const d = new Date(isoZ)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  } catch {
    return ''
  }
}
</script>

<style scoped>
/* marquee */
.marquee-wrap {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.marquee-track {
  display: flex;
  width: max-content;
  min-width: 100%;
  will-change: transform;
  animation: marquee-left 18s linear infinite;
}

.marquee-content {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding-right: 2rem; /* 两段文字之间的间距 */
}

.group:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes marquee-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
