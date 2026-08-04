<template>
  <div class="space-y-6 lg:space-y-8 min-w-0">
    <!-- 顶部主视觉 -->
    <section
      class="relative overflow-hidden rounded-[2.8rem] border border-white/60 dark:border-gray-800/70 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,250,252,0.88))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(135deg,rgba(17,24,39,0.72),rgba(3,7,18,0.72))] backdrop-blur shadow-[0_20px_80px_-20px_rgba(34,197,94,0.25)]"
    >
      <div class="pointer-events-none absolute inset-0">
        <div
          class="absolute -top-20 right-[-40px] h-56 w-56 rounded-full bg-green-300/20 blur-3xl dark:bg-green-500/10"
        ></div>
        <div
          class="absolute -bottom-20 left-[-20px] h-56 w-56 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/10"
        ></div>
        <div
          class="absolute inset-0 opacity-[0.18] dark:opacity-[0.10]"
          style="
            background-image:
              linear-gradient(rgba(255, 255, 255, 0.32) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.32) 1px, transparent 1px);
            background-size: 28px 28px;
            mask-image: radial-gradient(circle at center, black, transparent 85%);
          "
        ></div>
      </div>

      <div class="relative p-6 sm:p-8 lg:p-10">
        <div class="grid min-w-0 grid-cols-1 items-stretch gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <!-- 左侧 -->
          <div class="min-w-0 space-y-6">
            <div class="space-y-3 min-w-0">
              <div
                class="inline-flex items-center gap-2 rounded-full border border-green-200/60 bg-white/70 px-4 py-2 text-xs font-black text-green-700 shadow-sm dark:border-green-800/50 dark:bg-gray-900/40 dark:text-green-300"
              >
                <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                智能农业工作台
              </div>

              <div class="min-w-0">
                <h1
                  class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-gray-100 break-words"
                >
                  {{ greeting }}，{{ userName }}
                </h1>
                <p
                  class="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-gray-600 dark:text-gray-300"
                >
                  今天的农事信息已经为你整理完成。先看看天气预警、订单动态和通知提醒，再安排今天的工作节奏。
                </p>
              </div>
            </div>

            <!-- 超大时间 -->
            <div
              class="min-w-0 overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/35"
            >
              <div class="text-xs font-black tracking-[0.25em] text-gray-400 uppercase">
                当前时间
              </div>

              <div class="mt-4 min-w-0 overflow-hidden">
                <div class="time-row">
                  <template v-for="(char, idx) in timeChars" :key="idx">
                    <span v-if="char === ':'" class="time-sep">:</span>
                    <div v-else class="digit-shell">
                      <Transition name="digit-slide" mode="out-in">
                        <span class="time-digit" :key="`${idx}-${char}`">
                          {{ char }}
                        </span>
                      </Transition>
                    </div>
                  </template>
                </div>
              </div>

              <div class="mt-4 flex flex-col gap-2 min-w-0">
                <div class="text-sm sm:text-base font-bold text-gray-600 dark:text-gray-300">
                  {{ currentDateText }}
                </div>

                <div class="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-medium">
                  <div
                    class="inline-flex items-center gap-1.5 rounded-lg border border-green-200/70 bg-green-50/80 px-2.5 py-1 text-green-700 shadow-sm dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-300"
                  >
                    <i class="pi pi-moon text-[10px] opacity-70"></i>
                    <span>{{ lunarDateText }}</span>
                  </div>

                  <div
                    class="inline-flex items-center gap-1.5 rounded-lg border border-orange-200/70 bg-orange-50/80 px-2.5 py-1 text-orange-700 shadow-sm dark:border-orange-800/50 dark:bg-orange-900/30 dark:text-orange-300"
                  >
                    <i class="pi pi-sun text-[10px] opacity-70"></i>
                    <span>{{ solarTermText }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 缩略指标 -->
            <div class="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
              <button
                class="min-w-0 rounded-[1.8rem] border border-white/70 bg-white/65 p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/35"
                @click="go('/app/fields')"
              >
                <div class="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400">
                  地块数量
                </div>
                <div class="mt-3 text-3xl font-black text-gray-900 dark:text-gray-100">
                  {{ fieldCount }}
                </div>
                <div class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400 break-words">
                  查看地块与种植计划
                </div>
              </button>

              <button
                class="min-w-0 rounded-[1.8rem] border border-white/70 bg-white/65 p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/35"
                @click="go('/app/cart')"
              >
                <div class="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400">
                  购物车
                </div>
                <div class="mt-3 text-3xl font-black text-gray-900 dark:text-gray-100">
                  {{ cartCount }}
                </div>
                <div class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400 break-words">
                  待处理商品
                </div>
              </button>

              <button
                class="min-w-0 rounded-[1.8rem] border border-white/70 bg-white/65 p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/35"
                @click="go('/app/notifications')"
              >
                <div class="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400">
                  未读通知
                </div>
                <div class="mt-3 text-3xl font-black text-gray-900 dark:text-gray-100">
                  {{ unreadCount }}
                </div>
                <div class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400 break-words">
                  查看提醒与消息
                </div>
              </button>
            </div>
          </div>

          <!-- 右侧 -->
          <div class="min-w-0 space-y-4">
            <div
              class="min-w-0 overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/35"
            >
              <div class="flex min-w-0 items-center justify-between gap-3">
                <div class="min-w-0">
                  <div class="text-xs font-black tracking-[0.22em] text-gray-400 uppercase">
                    Weather Preview
                  </div>
                  <div class="mt-1 text-xl font-black text-gray-900 dark:text-gray-100">
                    天气与预警
                  </div>
                </div>

                <Button
                  label="查看详情"
                  icon="pi pi-arrow-right"
                  severity="secondary"
                  outlined
                  class="!rounded-full shrink-0"
                  @click="go('/app/weather')"
                />
              </div>

              <div class="mt-4 min-w-0 overflow-hidden">
                <WeatherAlerts :locationCode="locationCode" />
              </div>
            </div>

            <div class="grid min-w-0 grid-cols-2 gap-4">
              <button
                v-for="item in quickPanels"
                :key="item.title"
                class="group min-w-0 rounded-[1.8rem] border border-white/70 bg-white/65 p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/35"
                @click="go(item.to)"
              >
                <div
                  class="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-md"
                  :class="item.color"
                >
                  <i :class="item.icon"></i>
                </div>
                <div class="mt-4 text-lg font-black text-gray-900 dark:text-gray-100 break-words">
                  {{ item.title }}
                </div>
                <div class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400 break-words">
                  {{ item.desc }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 中下：最近通知 + 最近订单 -->
    <section class="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
      <!-- 最近通知 -->
      <Card
        class="min-w-0 overflow-hidden rounded-[2.4rem] border border-gray-100 dark:border-gray-800/70 bg-white/85 dark:bg-gray-900/50 backdrop-blur shadow-sm"
      >
        <template #content>
          <div class="space-y-5 min-w-0">
            <div class="flex min-w-0 items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-black tracking-[0.22em] text-gray-400 uppercase">
                  Notifications
                </div>
                <div class="mt-1 text-xl font-black text-gray-900 dark:text-gray-100">最近通知</div>
              </div>

              <Button
                label="全部通知"
                icon="pi pi-bell"
                severity="secondary"
                outlined
                class="!rounded-full shrink-0"
                @click="go('/app/notifications')"
              />
            </div>

            <div v-if="loadingNotifications" class="space-y-3">
              <Skeleton v-for="n in 3" :key="n" height="84px" class="rounded-2xl" />
            </div>

            <div
              v-else-if="!notifications.length"
              class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-6 text-sm text-gray-500 dark:text-gray-400"
            >
              暂无通知。
            </div>

            <div v-else class="space-y-3 min-w-0">
              <button
                v-for="item in notifications"
                :key="item._id"
                class="w-full min-w-0 rounded-2xl border border-gray-100 dark:border-gray-800/70 p-4 text-left transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                @click="go('/app/notifications')"
              >
                <div class="flex min-w-0 items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <Tag :severity="typeSeverity(item.type)" :value="typeLabel(item.type)" />
                      <Tag v-if="!item.readAt" severity="warn" value="未读" />
                    </div>

                    <div
                      class="mt-2 text-base font-black text-gray-900 dark:text-gray-100 line-clamp-1"
                    >
                      {{ item.title }}
                    </div>
                    <div
                      class="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400 line-clamp-2"
                    >
                      {{ item.content }}
                    </div>
                  </div>

                  <div class="shrink-0 text-[11px] font-bold text-gray-400">
                    {{ formatTime(item.createdAt) }}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </template>
      </Card>

      <!-- 最近订单 -->
      <Card
        class="min-w-0 overflow-hidden rounded-[2.4rem] border border-gray-100 dark:border-gray-800/70 bg-white/85 dark:bg-gray-900/50 backdrop-blur shadow-sm"
      >
        <template #content>
          <div class="space-y-5 min-w-0">
            <div class="flex min-w-0 items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-black tracking-[0.22em] text-gray-400 uppercase">
                  Orders
                </div>
                <div class="mt-1 text-xl font-black text-gray-900 dark:text-gray-100">最近订单</div>
              </div>

              <Button
                label="全部订单"
                icon="pi pi-receipt"
                severity="secondary"
                outlined
                class="!rounded-full shrink-0"
                @click="go('/app/orders')"
              />
            </div>

            <div v-if="loadingOrders" class="space-y-3">
              <Skeleton v-for="n in 3" :key="n" height="96px" class="rounded-2xl" />
            </div>

            <div
              v-else-if="!orders.length"
              class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-6 text-sm text-gray-500 dark:text-gray-400"
            >
              暂无订单。
            </div>

            <div v-else class="space-y-3 min-w-0">
              <button
                v-for="order in orders"
                :key="order._id"
                class="w-full min-w-0 rounded-2xl border border-gray-100 dark:border-gray-800/70 p-4 text-left transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                @click="go('/app/orders')"
              >
                <div class="flex min-w-0 items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <Tag
                        :severity="orderStatusSeverity(order.status)"
                        :value="orderStatusLabel(order.status)"
                      />
                    </div>
                    <div
                      class="mt-2 text-base font-black text-gray-900 dark:text-gray-100 break-all"
                    >
                      {{ order._id }}
                    </div>
                    <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      共 {{ order.items?.length || 0 }} 件商品
                    </div>
                  </div>

                  <div class="shrink-0 text-right">
                    <div class="text-lg font-black text-green-700 dark:text-green-300">
                      ¥{{ formatPrice(order.totalAmount) }}
                    </div>
                    <div class="mt-1 text-[11px] font-bold text-gray-400">
                      {{ formatTime(order.createdAt) }}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'

import WeatherAlerts from '@/components/weather/WeatherAlerts.vue'

import { apiGetUserProfile } from '@/api/userProfile.api'
import { apiGetNotifications } from '@/api/notifications.api'
import { apiGetMyOrders } from '@/api/orders.api'
import { apiGetFields } from '@/api/fields.api.js'
import { apiGetMyCart } from '@/api/cart.api'
import { getLocation } from '@/api/location.api'
import { Solar } from 'lunar-javascript'

const router = useRouter()

const profile = ref(null)
const now = ref(new Date())
const locationCode = ref('101060101')
const locationName = ref('吉林省长春')
const fieldCount = ref(0)
const cartCount = ref(0)
const unreadCount = ref(0)
const notifications = ref([])
const orders = ref([])

const loadingNotifications = ref(false)
const loadingOrders = ref(false)

let timer = null

const userName = computed(() => profile.value?.name || '新农人')

const greeting = computed(() => {
  const hour = now.value.getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const weekdayText = computed(() => {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekdays[now.value.getDay()]
})

const currentDateText = computed(() => {
  const y = now.value.getFullYear()
  const m = String(now.value.getMonth() + 1).padStart(2, '0')
  const d = String(now.value.getDate()).padStart(2, '0')
  return `${y}.${m}.${d} · ${weekdayText.value}`
})
// 新增：农历文本计算
const lunarDateText = computed(() => {
  try {
    const solar = Solar.fromDate(now.value)
    const lunar = solar.getLunar()
    // 输出示例: 甲辰年 三月十六
    return `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
  } catch (e) {
    console.log(e)
    return '农历加载中'
  }
})

// 新增：二十四节气计算
const solarTermText = computed(() => {
  try {
    const solar = Solar.fromDate(now.value)
    const lunar = solar.getLunar()

    // getJieQi() 获取当天的节气，如果今天不是节气交接日，则返回空字符串
    const jieQiToday = lunar.getJieQi()
    if (jieQiToday) {
      return `今日 ${jieQiToday}`
    }

    // 如果今天不是节气日，则获取当前正处于的节气（getPrevJieQi(true) 包含当天）
    const currentJieQi = lunar.getPrevJieQi(true)
    return currentJieQi ? `${currentJieQi.getName()}候` : '未知节气'
  } catch (e) {
    console.log(e)
    return '节气加载中'
  }
})
const timeChars = computed(() => {
  const hh = String(now.value.getHours()).padStart(2, '0')
  const mm = String(now.value.getMinutes()).padStart(2, '0')
  const ss = String(now.value.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`.split('')
})

const quickPanels = [
  {
    title: '地块',
    desc: '查看种植进度与地块资料',
    icon: 'pi pi-map',
    color: 'bg-gradient-to-br from-green-600 to-green-500',
    to: '/app/fields',
  },
  {
    title: '商城',
    desc: '快速采购所需农资商品',
    icon: 'pi pi-shopping-bag',
    color: 'bg-gradient-to-br from-purple-600 to-fuchsia-500',
    to: '/app/shop',
  },
  {
    title: '订单',
    desc: '查看待处理与购买记录',
    icon: 'pi pi-receipt',
    color: 'bg-gradient-to-br from-orange-500 to-amber-500',
    to: '/app/orders',
  },
  {
    title: 'AI 识别',
    desc: '进入植物识别与辅助判断',
    icon: 'pi pi-camera',
    color: 'bg-gradient-to-br from-blue-600 to-cyan-500',
    to: '/app/ai',
  },
]

function go(path) {
  router.push(path)
}

function formatPrice(val) {
  const num = Number(val || 0)
  if (!Number.isFinite(num)) return '0.00'
  return num.toFixed(2)
}

function formatTime(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '-'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}

function typeLabel(type) {
  const map = {
    FIELD: '地块',
    ORDER: '订单',
    WEATHER: '天气',
    SYSTEM: '系统',
  }
  return map[type] || type || '通知'
}

function typeSeverity(type) {
  const map = {
    FIELD: 'success',
    ORDER: 'info',
    WEATHER: 'warn',
    SYSTEM: 'secondary',
  }
  return map[type] || 'secondary'
}

function orderStatusLabel(status) {
  const map = {
    pending: '待处理',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status || '未知状态'
}

function orderStatusSeverity(status) {
  const map = {
    pending: 'warn',
    paid: 'info',
    shipped: 'success',
    completed: 'success',
    cancelled: 'danger',
  }
  return map[status] || 'secondary'
}

async function loadProfileAndLocation() {
  try {
    const res = await apiGetUserProfile()
    profile.value = res?.data || null

    const defaultLocation = res?.data?.defaultLocation || '101060101'
    locationCode.value = defaultLocation

    try {
      const geo = await getLocation({ location: defaultLocation })
      const item = geo?.data?.location?.[0]
      if (item) {
        locationCode.value = item.id || defaultLocation
        locationName.value = `${item.adm1 || ''}${item.adm2 || item.name || ''}` || '默认地区'
      }
    } catch {
      locationName.value = '默认地区'
    }
  } catch {
    profile.value = null
    locationCode.value = '101060101'
    locationName.value = '吉林省长春'
  }
}

async function loadFieldCount() {
  try {
    const res = await apiGetFields()
    fieldCount.value = Array.isArray(res?.data) ? res.data.length : 0
  } catch {
    fieldCount.value = 0
  }
}

async function loadCartCount() {
  try {
    const res = await apiGetMyCart()
    const items = Array.isArray(res?.data?.items) ? res.data.items : []
    cartCount.value = items.reduce((sum, item) => sum + Number(item.qty || 0), 0)
  } catch {
    cartCount.value = 0
  }
}

async function loadNotifications() {
  loadingNotifications.value = true
  try {
    const res = await apiGetNotifications({ page: 1, limit: 3 })
    const items = Array.isArray(res?.data?.items) ? res.data.items : []
    notifications.value = items
    unreadCount.value = items.filter((x) => !x.readAt).length
  } catch {
    notifications.value = []
    unreadCount.value = 0
  } finally {
    loadingNotifications.value = false
  }
}

async function loadOrders() {
  loadingOrders.value = true
  try {
    const res = await apiGetMyOrders({ page: 1, limit: 3 })
    orders.value = Array.isArray(res?.data?.items) ? res.data.items : []
  } catch {
    orders.value = []
  } finally {
    loadingOrders.value = false
  }
}

onMounted(async () => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)

  await Promise.all([
    loadProfileAndLocation(),
    loadFieldCount(),
    loadCartCount(),
    loadNotifications(),
    loadOrders(),
  ])
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.time-row {
  display: flex;
  align-items: flex-end;
  gap: 0.35rem;
  flex-wrap: nowrap;
  min-width: 0;
  max-width: 100%;
}

.digit-shell {
  width: clamp(2.35rem, 7vw, 4.9rem);
  height: clamp(3.2rem, 8.4vw, 6rem);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex: 0 0 auto;
}

.time-digit,
.time-sep {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  line-height: 1;
}

.time-digit {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.88);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 10px 30px rgba(15, 23, 42, 0.06);
  color: rgb(17 24 39);
  font-size: clamp(2.1rem, 6vw, 4.6rem);
  font-variant-numeric: tabular-nums;
}

:global(.dark) .time-digit {
  background: rgba(17, 24, 39, 0.76);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 10px 30px rgba(0, 0, 0, 0.22);
  color: rgb(243 244 246);
}

.time-sep {
  width: clamp(1rem, 2vw, 1.25rem);
  height: clamp(3.2rem, 8.4vw, 6rem);
  color: rgb(22 163 74);
  font-size: clamp(2.3rem, 6vw, 4.9rem);
  font-weight: 900;
  opacity: 1;
  text-shadow: 0 0 18px rgba(34, 197, 94, 0.2);
  flex: 0 0 auto;
}

:global(.dark) .time-sep {
  color: rgb(74 222 128);
  text-shadow: 0 0 18px rgba(74, 222, 128, 0.35);
}

.digit-slide-enter-active,
.digit-slide-leave-active {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}

.digit-slide-enter-from {
  opacity: 0;
  transform: translateY(22px);
}

.digit-slide-leave-to {
  opacity: 0;
  transform: translateY(-22px);
}
</style>
