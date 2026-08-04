<template>
  <div class="min-h-[calc(100vh-64px)] p-4 md:p-6 space-y-6">
    <section class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">通知中心</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          查看订单、天气、地块及系统通知。
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button
          label="全部标记已读"
          icon="pi pi-check"
          severity="success"
          outlined
          :disabled="notificationStore.unreadCount === 0"
          :loading="markingAll"
          @click="markAllRead"
        />
        <Button
          label="清空已读"
          icon="pi pi-trash"
          severity="danger"
          outlined
          :disabled="!hasReadNotifications"
          :loading="clearingRead"
          @click="clearRead"
        />
        <Button
          label="刷新"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          :loading="loading"
          @click="loadNotifications"
        />
      </div>
    </section>

    <!-- 顶部概览 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
        <template #content>
          <div class="text-xs text-gray-400">未读通知</div>
          <div class="mt-1 text-3xl font-black text-green-700 dark:text-green-300">
            {{ notificationStore.unreadCount }}
          </div>
        </template>
      </Card>

      <Card class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
        <template #content>
          <div class="text-xs text-gray-400">当前页数量</div>
          <div class="mt-1 text-3xl font-black text-gray-900 dark:text-gray-100">
            {{ notifications.length }}
          </div>
        </template>
      </Card>

      <Card class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
        <template #content>
          <div class="text-xs text-gray-400">通知总数</div>
          <div class="mt-1 text-3xl font-black text-gray-900 dark:text-gray-100">
            {{ total }}
          </div>
        </template>
      </Card>
    </div>

    <!-- 筛选 -->
    <Card class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              通知类型
            </label>
            <Select
              v-model="filters.type"
              :options="typeOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              placeholder="全部类型"
              @update:modelValue="handleFilterChange"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              已读状态
            </label>
            <Select
              v-model="filters.unread"
              :options="readOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              placeholder="全部"
              @update:modelValue="handleFilterChange"
            />
          </div>

          <div class="flex items-end gap-2">
            <Button
              label="重置筛选"
              icon="pi pi-filter-slash"
              severity="secondary"
              outlined
              class="w-full"
              @click="resetFilters"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- 列表 -->
    <div v-if="loading" class="space-y-4">
      <Skeleton v-for="n in 5" :key="n" height="120px" class="rounded-3xl" />
    </div>

    <div
      v-else-if="!notifications.length"
      class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/50 p-10 text-center shadow-sm"
    >
      <div class="text-lg font-black text-gray-900 dark:text-gray-100">暂无通知</div>
      <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        当前筛选条件下没有可显示的通知。
      </div>
    </div>

    <div v-else class="space-y-4">
      <Card
        v-for="item in notifications"
        :key="item._id"
        class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm overflow-hidden"
      >
        <template #content>
          <div class="space-y-4">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <Tag :severity="typeSeverity(item.type)" :value="typeLabel(item.type)" />
                  <Tag :severity="levelSeverity(item.level)" :value="levelLabel(item.level)" />
                  <Tag v-if="!item.readAt" severity="warn" value="未读" />
                  <Tag v-else severity="success" value="已读" />
                </div>

                <div class="mt-3 text-lg font-black text-gray-900 dark:text-gray-100 break-words">
                  {{ item.title }}
                </div>

                <div class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-6 break-words">
                  {{ item.content }}
                </div>

                <div class="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                  <span>创建时间：{{ formatDateTime(item.createdAt) }}</span>
                  <span v-if="item.readAt">已读时间：{{ formatDateTime(item.readAt) }}</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 shrink-0">
                <Button
                  v-if="!item.readAt"
                  label="标记已读"
                  icon="pi pi-check"
                  severity="success"
                  outlined
                  size="small"
                  :loading="markingId === item._id"
                  @click="markRead(item)"
                />
                <Button
                  label="查看详情"
                  icon="pi pi-eye"
                  severity="secondary"
                  size="small"
                  @click="toggleExpand(item._id)"
                />
                <Button
                  label="删除"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  size="small"
                  :loading="deletingId === item._id"
                  @click="removeNotification(item)"
                />
              </div>
            </div>

            <div
              v-if="expandedIds.includes(item._id)"
              class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4 space-y-3"
            >
              <div>
                <div class="text-xs text-gray-400">通知 ID</div>
                <div class="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100 break-all">
                  {{ item._id }}
                </div>
              </div>

              <div v-if="item.meta && Object.keys(item.meta).length">
                <div class="text-xs text-gray-400">业务信息</div>
                <pre
                  class="mt-1 text-xs whitespace-pre-wrap break-all text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900/40 rounded-2xl p-3"
                  >{{ formatMeta(item.meta) }}</pre
                >
              </div>

              <div v-if="item.dedupeKey">
                <div class="text-xs text-gray-400">去重键</div>
                <div class="mt-1 text-sm text-gray-700 dark:text-gray-300 break-all">
                  {{ item.dedupeKey }}
                </div>
              </div>

              <div v-if="item.expiresAt">
                <div class="text-xs text-gray-400">过期时间</div>
                <div class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {{ formatDateTime(item.expiresAt) }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <div class="flex justify-center">
        <Paginator
          :rows="limit"
          :totalRecords="total"
          :first="(page - 1) * limit"
          @page="onPageChange"
          template="PrevPageLink PageLinks NextPageLink"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import Paginator from 'primevue/paginator'
import { useNotificationStore } from '@/stores/notifications.js'
import {
  apiGetNotifications,
  apiMarkNotificationRead,
  apiMarkAllNotificationsRead,
  apiDeleteNotification,
  apiClearReadNotifications,
} from '@/api/notifications.api'

const toast = useToast()

const loading = ref(false)
const markingAll = ref(false)
const markingId = ref('')
const deletingId = ref('')
const clearingRead = ref(false)

const notifications = ref([])
const notificationStore = useNotificationStore()
const total = ref(0)
const page = ref(1)
const limit = ref(20)

const expandedIds = ref([])

const filters = ref({
  type: '',
  unread: '',
})
const hasReadNotifications = computed(() => {
  return notifications.value.some((x) => !!x.readAt)
})
const typeOptions = [
  { label: '全部类型', value: '' },
  { label: '地块通知', value: 'FIELD' },
  { label: '订单通知', value: 'ORDER' },
  { label: '天气通知', value: 'WEATHER' },
  { label: '系统通知', value: 'SYSTEM' },
]

const readOptions = [
  { label: '全部', value: '' },
  { label: '只看未读', value: '1' },
]

function typeLabel(type) {
  const map = {
    FIELD: '地块',
    ORDER: '订单',
    WEATHER: '天气',
    SYSTEM: '系统',
  }
  return map[type] || type || '未知'
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

function levelLabel(level) {
  const map = {
    info: '普通',
    warn: '提醒',
    danger: '重要',
  }
  return map[level] || level || '普通'
}

function levelSeverity(level) {
  const map = {
    info: 'info',
    warn: 'warn',
    danger: 'danger',
  }
  return map[level] || 'secondary'
}

function formatDateTime(dateStr) {
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

function formatMeta(meta) {
  try {
    return JSON.stringify(meta, null, 2)
  } catch {
    return String(meta)
  }
}

function toggleExpand(id) {
  if (expandedIds.value.includes(id)) {
    expandedIds.value = expandedIds.value.filter((x) => x !== id)
  } else {
    expandedIds.value.push(id)
  }
}


async function loadNotifications() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: limit.value,
    }

    if (filters.value.type) params.type = filters.value.type
    if (filters.value.unread) params.unread = filters.value.unread

    const res = await apiGetNotifications(params)
    const data = res?.data || {}

    notifications.value = Array.isArray(data.items) ? data.items : []
    total.value = Number(data.total || 0)
    page.value = Number(data.page || 1)
    limit.value = Number(data.limit || 20)
  } catch (e) {
    notifications.value = []
    total.value = 0
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '获取通知失败',
      life: 2200,
    })
  } finally {
    loading.value = false
  }
}

function handleFilterChange() {
  page.value = 1
  loadNotifications()
}

function resetFilters() {
  filters.value = {
    type: '',
    unread: '',
  }
  page.value = 1
  loadNotifications()
}

function onPageChange(event) {
  page.value = Math.floor(event.first / event.rows) + 1
  limit.value = event.rows
  loadNotifications()
}

async function markRead(item) {
  if (!item?._id) return

  markingId.value = item._id
  try {
    await apiMarkNotificationRead(item._id)

    notifications.value = notifications.value.map((x) =>
      x._id === item._id ? { ...x, readAt: new Date().toISOString() } : x,
    )

    notificationStore.decrementUnread(1)

    toast.add({
      severity: 'success',
      summary: '已标记为已读',
      life: 1600,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '标记失败',
      life: 2200,
    })
  } finally {
    markingId.value = ''
  }
}

async function markAllRead() {
  markingAll.value = true
  try {
    await apiMarkAllNotificationsRead()

    notifications.value = notifications.value.map((x) => ({
      ...x,
      readAt: x.readAt || new Date().toISOString(),
    }))

    notificationStore.clearUnread()

    toast.add({
      severity: 'success',
      summary: '已全部标记为已读',
      life: 1800,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '操作失败',
      life: 2200,
    })
  } finally {
    markingAll.value = false
  }
}

async function removeNotification(item) {
  if (!item?._id) return

  deletingId.value = item._id
  try {
    await apiDeleteNotification(item._id)

    const wasUnread = !item.readAt
    notifications.value = notifications.value.filter((x) => x._id !== item._id)
    total.value = Math.max(0, total.value - 1)

    if (wasUnread) {
      notificationStore.decrementUnread(1)
    }

    toast.add({
      severity: 'success',
      summary: '通知已删除',
      life: 1600,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '删除失败',
      life: 2200,
    })
  } finally {
    deletingId.value = ''
  }
}

async function clearRead() {
  clearingRead.value = true
  try {
    await apiClearReadNotifications()

    notifications.value = notifications.value.filter((x) => !x.readAt)
    total.value = notifications.value.length

    toast.add({
      severity: 'success',
      summary: '已清空已读通知',
      life: 1800,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '清空失败',
      life: 2200,
    })
  } finally {
    clearingRead.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadNotifications(), notificationStore.fetchUnreadCount()])
})
</script>
