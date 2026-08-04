<template>
  <div class="min-h-[calc(100vh-64px)] p-4 md:p-6 space-y-6">
    <section class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">我的订单</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          查看订单状态、购买记录，并可直接从购物车提交订单。
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button
          label="从购物车下单"
          icon="pi pi-credit-card"
          @click="createOrder"
          :loading="creatingOrder"
        />
        <Button
          label="刷新"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          :loading="loading"
          @click="loadOrders"
        />
      </div>
    </section>

    <!-- 顶部切换 -->
    <Card class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
      <template #content>
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="flex flex-wrap gap-2">
            <Button
              label="订单列表"
              :severity="viewMode === 'orders' ? 'success' : 'secondary'"
              :outlined="viewMode !== 'orders'"
              class="!rounded-full"
              @click="switchMode('orders')"
            />
            <Button
              label="购买记录"
              :severity="viewMode === 'purchases' ? 'success' : 'secondary'"
              :outlined="viewMode !== 'purchases'"
              class="!rounded-full"
              @click="switchMode('purchases')"
            />
          </div>

          <div v-if="viewMode === 'orders'" class="w-full lg:w-[320px]">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              订单状态
            </label>
            <Select
              v-model="status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              placeholder="全部状态"
              @update:modelValue="handleStatusChange"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- 加载态 -->
    <div v-if="loading" class="space-y-4">
      <Skeleton v-for="n in 4" :key="n" height="180px" class="rounded-3xl" />
    </div>

    <!-- 空态 -->
    <div
      v-else-if="!orders.length"
      class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/50 p-10 text-center shadow-sm"
    >
      <div class="text-lg font-black text-gray-900 dark:text-gray-100">
        {{ viewMode === 'orders' ? '暂无订单' : '暂无购买记录' }}
      </div>
      <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{
          viewMode === 'orders'
            ? '可以先去商城加购并提交订单。'
            : '发货或完成后的订单会显示在这里。'
        }}
      </div>
      <Button
        class="mt-5"
        label="前往商城"
        icon="pi pi-shopping-bag"
        @click="router.push('/app/shop')"
      />
    </div>

    <!-- 列表 -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between gap-3">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          共 {{ total }} 条{{ viewMode === 'orders' ? '订单' : '记录' }}
        </div>
      </div>

      <div class="space-y-4">
        <Card
          v-for="order in orders"
          :key="order._id"
          class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm overflow-hidden"
        >
          <template #content>
            <div class="space-y-5">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-lg font-black text-gray-900 dark:text-gray-100 break-all">
                      订单号：{{ order._id }}
                    </span>
                    <Tag
                      :severity="orderStatusSeverity(order.status)"
                      :value="orderStatusLabel(order.status)"
                    />
                  </div>

                  <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    下单时间：{{ formatDateTime(order.createdAt) }}
                  </div>

                  <div
                    v-if="order.shippingAddress"
                    class="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-6 break-words"
                  >
                    收货信息：{{ formatAddress(order.shippingAddress) }}
                  </div>
                </div>

                <div
                  class="rounded-2xl bg-green-50 dark:bg-green-500/10 px-4 py-3 text-right shrink-0"
                >
                  <div class="text-xs font-bold text-green-700 dark:text-green-300">订单金额</div>
                  <div class="text-2xl font-black text-green-800 dark:text-green-200">
                    ¥{{ formatPrice(order.totalAmount) }}
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div class="text-sm font-bold text-gray-700 dark:text-gray-200">商品清单</div>

                <div
                  v-for="item in order.items"
                  :key="item._id"
                  class="flex flex-col sm:flex-row gap-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4"
                >
                  <div class="shrink-0 overflow-hidden rounded-2xl bg-white dark:bg-gray-900/40">
                    <img
                      :src="item.image || 'https://placehold.co/240x240?text=Product'"
                      :alt="item.title"
                      class="h-20 w-20 object-cover"
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="text-base font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {{ item.title }}
                    </div>

                    <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>单价：¥{{ formatPrice(item.price) }}</span>
                      <span>数量：{{ item.qty }}</span>
                      <span>小计：¥{{ formatPrice(item.price * item.qty) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <Button
                  label="查看详情"
                  icon="pi pi-eye"
                  severity="secondary"
                  outlined
                  @click="openDetail(order)"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

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

    <!-- 订单详情弹窗 -->
    <Dialog v-model:visible="detailVisible" header="订单详情" modal class="w-[96vw] max-w-4xl">
      <div v-if="detailLoading" class="space-y-4">
        <Skeleton height="120px" class="rounded-3xl" />
        <Skeleton height="200px" class="rounded-3xl" />
      </div>

      <div v-else-if="detailOrder" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4">
            <div class="text-xs text-gray-400">订单号</div>
            <div class="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100 break-all">
              {{ detailOrder._id }}
            </div>
          </div>

          <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4">
            <div class="text-xs text-gray-400">状态</div>
            <div class="mt-1">
              <Tag
                :severity="orderStatusSeverity(detailOrder.status)"
                :value="orderStatusLabel(detailOrder.status)"
              />
            </div>
          </div>

          <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4">
            <div class="text-xs text-gray-400">下单时间</div>
            <div class="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">
              {{ formatDateTime(detailOrder.createdAt) }}
            </div>
          </div>

          <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4">
            <div class="text-xs text-gray-400">订单总金额</div>
            <div class="mt-1 text-lg font-black text-green-700 dark:text-green-300">
              ¥{{ formatPrice(detailOrder.totalAmount) }}
            </div>
          </div>
        </div>

        <div
          v-if="detailOrder.shippingAddress"
          class="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 p-4"
        >
          <div class="text-sm font-bold text-gray-900 dark:text-gray-100">收货地址</div>
          <div class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-6 break-words">
            {{ formatAddress(detailOrder.shippingAddress) }}
          </div>
        </div>

        <div class="space-y-3">
          <div class="text-sm font-bold text-gray-900 dark:text-gray-100">商品明细</div>

          <div
            v-for="item in detailOrder.items"
            :key="item._id"
            class="flex flex-col sm:flex-row gap-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4"
          >
            <div class="overflow-hidden rounded-2xl bg-white dark:bg-gray-900/40 shrink-0">
              <img
                :src="item.image || 'https://placehold.co/240x240?text=Product'"
                :alt="item.title"
                class="h-20 w-20 object-cover"
              />
            </div>

            <div class="min-w-0 flex-1">
              <div class="text-base font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                {{ item.title }}
              </div>
              <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>单价：¥{{ formatPrice(item.price) }}</span>
                <span>数量：{{ item.qty }}</span>
                <span>小计：¥{{ formatPrice(item.price * item.qty) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-10 text-center text-gray-500 dark:text-gray-400">订单详情获取失败</div>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import Paginator from 'primevue/paginator'

import {
  apiCreateOrderFromCart,
  apiGetMyOrders,
  apiGetMyOrderById,
  apiGetMyPurchases,
} from '@/api/orders.api'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const creatingOrder = ref(false)
const detailLoading = ref(false)

const viewMode = ref('orders') // orders | purchases
const status = ref('')
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const orders = ref([])

const detailVisible = ref(false)
const detailOrder = ref(null)

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '待处理', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
]

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

function formatPrice(val) {
  const num = Number(val || 0)
  if (!Number.isFinite(num)) return '0.00'
  return num.toFixed(2)
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

function formatAddress(addr) {
  const text = [
    addr?.receiver,
    addr?.phone,
    [addr?.province, addr?.city, addr?.district, addr?.detail].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(' ｜ ')
  return text || '-'
}

async function loadOrders() {
  loading.value = true
  try {
    let res

    if (viewMode.value === 'orders') {
      const params = {
        page: page.value,
        limit: limit.value,
      }
      if (status.value) params.status = status.value
      res = await apiGetMyOrders(params)
    } else {
      res = await apiGetMyPurchases({
        page: page.value,
        limit: limit.value,
      })
    }

    const data = res?.data || {}
    orders.value = Array.isArray(data.items) ? data.items : []
    total.value = Number(data.total || 0)
    page.value = Number(data.page || 1)
    limit.value = Number(data.limit || 10)
  } catch (e) {
    orders.value = []
    total.value = 0
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '获取订单失败',
      life: 2200,
    })
  } finally {
    loading.value = false
  }
}

function switchMode(mode) {
  viewMode.value = mode
  page.value = 1
  if (mode === 'purchases') {
    status.value = ''
  }
  loadOrders()
}

function handleStatusChange() {
  page.value = 1
  loadOrders()
}

function onPageChange(event) {
  page.value = Math.floor(event.first / event.rows) + 1
  limit.value = event.rows
  loadOrders()
}

async function createOrder() {
  creatingOrder.value = true
  try {
    await apiCreateOrderFromCart({})
    toast.add({
      severity: 'success',
      summary: '订单提交成功',
      detail: '已从购物车生成订单',
      life: 2200,
    })
    viewMode.value = 'orders'
    status.value = ''
    page.value = 1
    loadOrders()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '提交订单失败',
      life: 2200,
    })
  } finally {
    creatingOrder.value = false
  }
}

async function openDetail(order) {
  if (!order?._id) return
  detailVisible.value = true
  detailLoading.value = true
  detailOrder.value = null

  try {
    const res = await apiGetMyOrderById(order._id)
    detailOrder.value = res?.data || null
  } catch (e) {
    detailOrder.value = null
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '获取订单详情失败',
      life: 2200,
    })
  } finally {
    detailLoading.value = false
  }
}

onMounted(() => {
  loadOrders()
})
</script>
