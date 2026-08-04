<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-800 dark:text-gray-100 overflow-x-hidden font-sans selection:bg-green-500/30"
  >
    <!-- 点状背景 -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute inset-0 opacity-[0.14] dark:opacity-[0.18]"
        style="
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.16) 1.2px, transparent 1.2px);
          background-size: 22px 22px;
          background-position: 0 0;
        "
      ></div>
      <div
        class="absolute inset-0 opacity-[0.10] dark:opacity-[0.14]"
        style="
          background-image: radial-gradient(circle, rgba(34, 197, 94, 0.22) 1px, transparent 1px);
          background-size: 44px 44px;
          background-position: 11px 11px;
        "
      ></div>
    </div>

    <!-- glow blobs -->
    <div
      class="fixed -top-44 left-1/2 -translate-x-1/2 w-[920px] h-[620px] bg-green-100/60 dark:bg-green-900/20 rounded-full blur-[150px] -z-10"
    ></div>
    <div
      class="fixed top-44 -left-44 w-[560px] h-[560px] bg-blue-100/55 dark:bg-blue-900/15 rounded-full blur-[150px] -z-10"
    ></div>
    <div
      class="fixed bottom-[-180px] right-[-180px] w-[620px] h-[620px] bg-purple-100/55 dark:bg-purple-900/15 rounded-full blur-[170px] -z-10"
    ></div>

    <!-- Mobile Drawer -->
    <Drawer
      v-model:visible="mobileSidebarOpen"
      position="left"
      class="!w-[86vw] sm:!w-[360px] dark:!bg-[#0B0F19] !border-0"
    >
      <template #header>
        <div class="flex items-center gap-3 select-none">
          <div class="flex items-center gap-3 select-none">
            <div class="w-9 h-9 rounded-xl bg-white dark:bg-gray-800
              flex items-center justify-center
              border border-gray-200 dark:border-gray-700">
              <img
                src="@/assets/favicon.svg"
                alt="logo"
                class="w-5 h-5 object-contain select-none pointer-events-none"
              />
            </div>

            <div class="flex flex-col">
              <span class="text-lg font-black leading-none">农田助手</span>
              <span class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
      Pastoral Assistant
    </span>
            </div>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <div
          class="rounded-2xl p-4 bg-white/85 dark:bg-gray-900/50 backdrop-blur border border-gray-100 dark:border-gray-800/70"
        >
          <div class="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">导航</div>

          <div class="space-y-1">
            <button
              v-for="item in nav"
              :key="item.to"
              class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-black transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]"
              :class="
                isActive(item.to)
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 ring-1 ring-green-500/30 hover:bg-green-500 hover:text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-300 hover:ring-1 hover:ring-green-500/15 dark:hover:ring-green-400/15'
              "
              @click="go(item.to, true)"
            >
              <span
                class="w-1.5 h-6 rounded-full transition-all"
                :class="
                  isActive(item.to) ? 'bg-white' : 'bg-transparent group-hover:bg-green-500/40'
                "
              ></span>
              <i :class="item.icon" class="text-base"></i>
              <span class="flex-1 text-left">{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="text-[10px] px-2 py-0.5 rounded-full"
                :class="
                  isActive(item.to)
                    ? 'bg-white/20 text-white'
                    : 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
                "
              >
                {{ item.badge }}
              </span>
            </button>
          </div>
        </div>

        <div
          class="rounded-2xl p-4 bg-gradient-to-br from-green-600 to-green-500 text-white overflow-hidden relative shadow-lg shadow-green-600/20"
        >
          <i class="pi pi-sparkles absolute -right-6 -top-6 text-[96px] opacity-20"></i>
          <div class="relative">
            <div class="text-sm font-black">今日建议</div>
            <div class="text-xs opacity-90 mt-2 leading-relaxed">
              预计 24h 后降温，建议检查保温物资；玉米价格临近阶段高点，留意出售窗口。
            </div>
            <Button
              label="查看工作台"
              icon="pi pi-arrow-right"
              class="mt-4 !bg-white/15 !border-white/20 !text-white !rounded-full"
              @click="go('/app/dashboard', true)"
            />
          </div>
        </div>
      </div>
    </Drawer>

    <!-- Topbar -->
    <header class="fixed top-0 left-0 right-0 z-40">
      <div
        class="bg-white/80 dark:bg-[#0B0F19]/75 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/80"
      >
        <div
          class="mx-auto w-full max-w-[1520px] 2xl:max-w-[1680px] px-4 sm:px-6 h-18 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3 min-w-0">
            <button
              class="lg:hidden w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/70 flex items-center justify-center transition"
              @click="mobileSidebarOpen = true"
            >
              <i class="pi pi-bars text-gray-600 dark:text-gray-200"></i>
            </button>

            <div class="hidden sm:flex items-center gap-3 select-none">
              <!-- favicon 图标 -->
              <div
                class="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <img
                  src="@/assets/favicon.svg"
                  alt="logo"
                  class="w-5 h-5 object-contain select-none pointer-events-none"
                />
              </div>

              <!-- 文字 -->
              <div class="flex flex-col leading-none">
                <span class="text-lg font-black truncate">农田助手</span>
                <span class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                  Pastoral Assistant
                </span>
              </div>
            </div>

            <div class="ml-2 sm:ml-6 min-w-0">
              <div
                class="text-xs text-gray-400 dark:text-gray-500 font-black tracking-wider uppercase hidden sm:block"
              >
                {{ subtitle }}
              </div>
              <div class="text-lg font-black truncate">{{ pageTitle }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <button
              @click="themeStore.toggleDark($event)"
              class="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/70 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
            >
              <i
                class="transition-transform duration-500 rotate-0 dark:rotate-360"
                :class="themeStore.isDark ? 'pi pi-moon' : 'pi pi-sun text-yellow-500'"
              ></i>
            </button>

            <div class="flex items-center gap-2 pl-1">
              <button
                class="flex items-center gap-2 rounded-2xl px-2 py-1 transition hover:bg-gray-100 dark:hover:bg-gray-800/70"
                @click="go('/app/profile')"
              >
                <Avatar
                  :image="userAvatarSrc"
                  :label="!userAvatarSrc ? userInitial : undefined"
                  shape="circle"
                  class="!bg-green-600 !text-white overflow-hidden"
                />
                <div class="hidden lg:flex flex-col leading-tight max-w-[140px] text-left">
                  <span class="text-sm font-black truncate">{{ userName }}</span>
                  <span class="text-[11px] text-gray-400 dark:text-gray-500 font-black">
                    农业经营者
                  </span>
                </div>
              </button>

              <Button
                label="退出"
                icon="pi pi-sign-out"
                severity="danger"
                text
                class="rounded-full!"
                @click="logoutConfirmVisible = true"
              />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main -->
    <div
      class="relative z-10 mx-auto w-full max-w-[1520px] 2xl:max-w-[1680px] px-4 sm:px-6 pt-24 pb-6 lg:pb-8"
    >
      <div class="grid grid-cols-12 gap-6">
        <!-- Desktop Sidebar -->
        <aside class="hidden lg:block col-span-3 xl:col-span-2">
          <div class="fixed top-[88px] z-30">
            <div class="w-[260px] xl:w-[280px] pr-2">
              <div class="space-y-4 h-[calc(100vh-104px)] overflow-y-auto">
                <div
                  class="rounded-3xl bg-white/85 dark:bg-gray-900/50 backdrop-blur border border-gray-100 dark:border-gray-800/70 shadow-sm overflow-hidden"
                >
                  <div class="p-4 border-b border-gray-100 dark:border-gray-800/70">
                    <div class="text-xs font-black text-gray-400 uppercase tracking-wider">
                      导航
                    </div>
                  </div>
                  <div class="p-3">
                    <button
                      v-for="item in nav"
                      :key="item.to"
                      class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-black transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]"
                      :class="
                        isActive(item.to)
                          ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 ring-1 ring-green-500/30 hover:bg-green-500 hover:text-white'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-300 hover:ring-1 hover:ring-green-500/15 dark:hover:ring-green-400/15'
                      "
                      @click="go(item.to)"
                    >
                      <span
                        class="w-1.5 h-6 rounded-full transition-all"
                        :class="
                          isActive(item.to)
                            ? 'bg-white'
                            : 'bg-transparent group-hover:bg-green-500/40'
                        "
                      ></span>
                      <i :class="item.icon" class="text-base"></i>
                      <span class="flex-1 text-left">{{ item.label }}</span>
                      <Badge v-if="item.badge" :value="item.badge" severity="danger" />
                    </button>
                  </div>
                </div>

                <div
                  class="rounded-3xl bg-gradient-to-br from-green-600 to-green-500 text-white p-5 overflow-hidden relative shadow-lg shadow-green-600/20"
                >
                  <i class="pi pi-sparkles absolute -right-6 -top-6 text-[110px] opacity-20"></i>
                  <div class="relative">
                    <div class="text-sm font-black">全能田间助手</div>
                    <div class="text-xs opacity-90 mt-2 leading-relaxed">
                      无论气候变化、市场趋势，您都能第一时间掌握。做出最佳决策，轻松管理农田！
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main class="col-span-12 lg:ml-[260px] xl:ml-[280px]">
          <router-view v-slot="{ Component, route }">
            <Transition name="fadeUp" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </Transition>
          </router-view>
        </main>
      </div>
    </div>
    <Dialog
      v-model:visible="logoutConfirmVisible"
      header="确认退出登录"
      modal
      class="w-[92vw] max-w-sm"
    >
      <div class="text-sm text-gray-600 dark:text-gray-300 leading-6">
        退出后将返回登录页，是否继续？
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="logoutConfirmVisible = false" />
          <Button label="确认退出" severity="danger" icon="pi pi-sign-out" @click="confirmLogout" />
        </div>
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Dialog from 'primevue/dialog'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Toast from 'primevue/toast'


import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { apiGetUserProfile } from '@/api/userProfile.api'
import { avatarSrcByKey } from '@/utils/avatar'
import { useNotificationStore } from '@/stores/notifications'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const mobileSidebarOpen = ref(false)

const profile = ref(null)
const notificationStore = useNotificationStore()

const logoutConfirmVisible = ref(false)

const pageTitle = computed(() => route.meta?.title || '工作台')
const subtitle = computed(() => {
  const map = {
    工作台: 'Dashboard',
    农资商城: 'Shop',
    购物车: 'Cart',
    我的订单: 'Orders',
    农田管理: 'Fields',
    玉米行情: 'Market',
    天气: 'Weather',
    农业资讯: 'News',
    'AI 识别': 'AI',
    通知中心: 'Notifications',
    个人资料: 'Profile',
  }
  return map[pageTitle.value] || 'App'
})

const nav = computed(() => [
  { label: '工作台', to: '/app/dashboard', icon: 'pi pi-home' },
  { label: '农田管理', to: '/app/fields', icon: 'pi pi-map' },
  { label: '玉米行情', to: '/app/market', icon: 'pi pi-chart-line' },
  { label: '天气', to: '/app/weather', icon: 'pi pi-cloud' },
  { label: '农资商城', to: '/app/shop', icon: 'pi pi-shopping-bag' },
  { label: '购物车', to: '/app/cart', icon: 'pi pi-shopping-cart' },
  { label: '我的订单', to: '/app/orders', icon: 'pi pi-receipt' },
  { label: '农业资讯', to: '/app/news', icon: 'pi pi-megaphone' },
  { label: 'AI 识别', to: '/app/ai', icon: 'pi pi-camera' },
  {
    label: '通知中心',
    to: '/app/notifications',
    icon: 'pi pi-bell',
    badge: notificationStore.unreadCount > 0 ? String(notificationStore.unreadCount) : '',
  },
  { label: '个人资料', to: '/app/profile', icon: 'pi pi-user' },
])

const userName = computed(() => profile.value?.name || '新农人')
const userAvatarSrc = computed(() => avatarSrcByKey(profile.value?.avatarKey || 'a1'))
const userInitial = computed(() => {
  const name = userName.value?.trim()
  return name ? name.slice(0, 1) : '农'
})

function isActive(path) {
  return route.path === path
}

function go(path, closeMobile = false) {
  router.push(path)
  if (closeMobile) mobileSidebarOpen.value = false
}

async function loadProfile() {
  try {
    const res = await apiGetUserProfile()
    profile.value = res?.data || null
  } catch {
    profile.value = null
  }
}

//退出登录
function confirmLogout() {
  logoutConfirmVisible.value = false
  authStore.logout()
}

onMounted(() => {
  loadProfile()
  notificationStore.fetchUnreadCount()
})
</script>

<style scoped>
.fadeUp-enter-active,
.fadeUp-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}
.fadeUp-enter-from,
.fadeUp-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
