<template>
  <div class="min-h-[calc(100vh-64px)] p-4 md:p-6 space-y-6">
    <section class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">购物车</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          管理已加入购物车的商品，选择后可进入下单流程。
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button
          label="刷新"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          :loading="loading"
          @click="loadCart"
        />
        <Button
          label="清空购物车"
          icon="pi pi-trash"
          severity="danger"
          outlined
          :disabled="!cartItems.length"
          @click="clearDialogVisible = true"
        />
      </div>
    </section>

    <div v-if="loading" class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div class="xl:col-span-8 space-y-4">
        <Skeleton v-for="n in 3" :key="n" height="140px" class="rounded-3xl" />
      </div>
      <div class="xl:col-span-4">
        <Skeleton height="260px" class="rounded-3xl" />
      </div>
    </div>

    <div
      v-else-if="!cartItems.length"
      class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/50 p-10 text-center shadow-sm"
    >
      <div class="text-lg font-black text-gray-900 dark:text-gray-100">购物车还是空的</div>
      <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        去商城挑选一些需要的农资商品吧。
      </div>
      <Button
        class="mt-5"
        label="前往商城"
        icon="pi pi-shopping-bag"
        @click="router.push('/app/shop')"
      />
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <!-- 左侧列表 -->
      <div class="xl:col-span-8 space-y-4">
        <Card class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
          <template #content>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <Checkbox
                  :modelValue="allChecked"
                  binary
                  inputId="checkAll"
                  @update:modelValue="toggleAllChecked"
                />
                <label
                  for="checkAll"
                  class="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  全选
                </label>
              </div>

              <div class="text-sm text-gray-500 dark:text-gray-400">
                共 {{ cartItems.length }} 件商品
              </div>
            </div>
          </template>
        </Card>

        <Card
          v-for="item in cartItems"
          :key="item._id"
          class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm overflow-hidden"
        >
          <template #content>
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex items-start gap-4 flex-1 min-w-0">
                <Checkbox
                  :modelValue="item.checked"
                  binary
                  :inputId="`cart-${item._id}`"
                  @update:modelValue="(val) => updateChecked(item, val)"
                />

                <button
                  class="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shrink-0"
                  @click="goProductDetail(item.productId?._id)"
                >
                  <img
                    :src="getProductImage(item)"
                    :alt="item.productId?.title || '商品图片'"
                    class="h-24 w-24 object-cover"
                  />
                </button>

                <div class="min-w-0 flex-1">
                  <button class="block text-left" @click="goProductDetail(item.productId?._id)">
                    <div class="text-base font-black text-gray-900 dark:text-gray-100 line-clamp-2">
                      {{ item.productId?.title || '商品已失效' }}
                    </div>
                  </button>

                  <div class="mt-2 flex flex-wrap items-center gap-2">
                    <Tag severity="secondary" :value="categoryLabel(item.productId?.category)" />
                    <span v-if="item.productId?.brand" class="text-xs text-gray-400">
                      {{ item.productId.brand }}
                    </span>
                  </div>

                  <div class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-3">
                      <div class="text-[11px] text-gray-400">单价</div>
                      <div class="mt-1 text-base font-black text-green-700 dark:text-green-300">
                        ¥{{ formatPrice(item.productId?.price) }}
                      </div>
                    </div>

                    <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-3">
                      <div class="text-[11px] text-gray-400">库存</div>
                      <div class="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                        {{ item.productId?.stock ?? 0 }}
                      </div>
                    </div>

                    <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-3">
                      <div class="text-[11px] text-gray-400">小计</div>
                      <div class="mt-1 text-base font-black text-gray-900 dark:text-gray-100">
                        ¥{{ formatPrice(itemSubtotal(item)) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="md:w-[200px] flex md:flex-col items-center md:items-end justify-between gap-3"
              >
                <div class="flex items-center gap-2">
                  <Button
                    icon="pi pi-minus"
                    severity="secondary"
                    outlined
                    size="small"
                    :disabled="updatingIds.includes(item._id) || item.qty <= 1"
                    @click="changeQty(item, item.qty - 1)"
                  />
                  <InputNumber
                    :modelValue="item.qty"
                    inputClass="w-16 text-center"
                    class="w-[82px]"
                    :min="1"
                    :useGrouping="false"
                    @update:modelValue="(val) => changeQty(item, val)"
                  />
                  <Button
                    icon="pi pi-plus"
                    severity="secondary"
                    outlined
                    size="small"
                    :disabled="updatingIds.includes(item._id)"
                    @click="changeQty(item, item.qty + 1)"
                  />
                </div>

                <Button
                  label="移除"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  :loading="removingId === item._id"
                  @click="removeItem(item)"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- 右侧结算 -->
      <div class="xl:col-span-4">
        <Card
          class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm sticky top-24"
        >
          <template #content>
            <div class="space-y-5">
              <div>
                <div class="text-lg font-extrabold text-gray-900 dark:text-gray-100">结算信息</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  已选商品 {{ checkedCount }} 件
                </div>
              </div>

              <div class="rounded-3xl bg-green-50 dark:bg-green-500/10 p-5">
                <div class="text-xs text-green-700 dark:text-green-300">合计金额</div>
                <div class="mt-1 text-3xl font-black text-green-700 dark:text-green-300">
                  ¥{{ formatPrice(checkedTotalPrice) }}
                </div>
              </div>

              <div class="space-y-3 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 dark:text-gray-400">商品总数</span>
                  <span class="font-bold text-gray-900 dark:text-gray-100">{{ totalQty }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 dark:text-gray-400">已选数量</span>
                  <span class="font-bold text-gray-900 dark:text-gray-100">{{ checkedQty }}</span>
                </div>
              </div>

              <div class="space-y-2">
                <Button
                  label="去下单"
                  icon="pi pi-credit-card"
                  class="w-full"
                  :disabled="checkedCount === 0"
                  @click="openCheckoutDialog"
                />
                <Button
                  label="继续逛商城"
                  icon="pi pi-shopping-bag"
                  severity="secondary"
                  outlined
                  class="w-full"
                  @click="router.push('/app/shop')"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- 清空确认 -->
    <Dialog
      v-model:visible="clearDialogVisible"
      header="确认清空购物车"
      modal
      class="w-[92vw] max-w-sm"
    >
      <div class="text-sm text-gray-600 dark:text-gray-300 leading-6">
        清空后购物车商品将全部移除，是否继续？
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="clearDialogVisible = false" />
          <Button
            label="确认清空"
            severity="danger"
            icon="pi pi-trash"
            :loading="clearing"
            @click="clearCart"
          />
        </div>
      </template>
    </Dialog>
    <CheckoutConfirmDialog
      v-model:visible="checkoutDialogVisible"
      :addresses="addresses"
      :checked-count="checkedCount"
      :total-amount="checkedTotalPrice"
      :submitting="creatingOrder"
      @confirm="checkout"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import InputNumber from 'primevue/inputnumber'
import Skeleton from 'primevue/skeleton'

import { apiGetMyCart, apiUpdateCartItem, apiRemoveCartItem, apiClearCart } from '@/api/cart.api'
import { apiCreateOrderFromCart } from '@/api/orders.api.js'
import { apiGetUserProfile } from '@/api/userProfile.api.js'
import CheckoutConfirmDialog from '@/components/cart/CheckoutConfirmDialog.vue'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const clearing = ref(false)
const removingId = ref('')
const updatingIds = ref([])
const creatingOrder = ref(false)

const clearDialogVisible = ref(false)
const checkoutDialogVisible = ref(false)

const cart = ref(null)
const addresses = ref([])

const cartItems = computed(() => {
  return Array.isArray(cart.value?.items) ? cart.value.items : []
})

const allChecked = computed(() => {
  if (!cartItems.value.length) return false
  return cartItems.value.every((item) => !!item.checked)
})

const checkedItems = computed(() => {
  return cartItems.value.filter((item) => item.checked)
})

const checkedCount = computed(() => checkedItems.value.length)

const totalQty = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + Number(item.qty || 0), 0)
})

const checkedQty = computed(() => {
  return checkedItems.value.reduce((sum, item) => sum + Number(item.qty || 0), 0)
})

const checkedTotalPrice = computed(() => {
  return checkedItems.value.reduce((sum, item) => sum + itemSubtotal(item), 0)
})

function formatPrice(val) {
  const num = Number(val || 0)
  if (!Number.isFinite(num)) return '0.00'
  return num.toFixed(2)
}

function itemSubtotal(item) {
  const price = Number(item?.productId?.price || 0)
  const qty = Number(item?.qty || 0)
  return price * qty
}

function categoryLabel(category) {
  const map = {
    seed: '种子',
    fertilizer: '化肥',
    pesticide: '农药',
  }
  return map[category] || '其他'
}

function getProductImage(item) {
  return item?.productId?.images?.[0] || 'https://placehold.co/400x400?text=Product'
}

async function loadCart() {
  loading.value = true
  try {
    const res = await apiGetMyCart()
    cart.value = res?.data || { items: [] }
  } catch (e) {
    cart.value = { items: [] }
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '获取购物车失败',
      life: 2200,
    })
  } finally {
    loading.value = false
  }
}

async function loadAddresses() {
  try {
    const res = await apiGetUserProfile()
    addresses.value = Array.isArray(res?.data?.addresses) ? res.data.addresses : []
  } catch {
    addresses.value = []
  }
}

function patchCartFromResponse(res) {
  cart.value = res?.data || { items: [] }
}

async function updateChecked(item, checked) {
  if (!item?._id) return
  try {
    const res = await apiUpdateCartItem(item._id, { checked })
    patchCartFromResponse(res)
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '更新失败',
      life: 2000,
    })
  }
}

async function toggleAllChecked(checked) {
  const targetChecked = Boolean(checked)
  const tasks = cartItems.value.map((item) =>
    apiUpdateCartItem(item._id, { checked: targetChecked }),
  )

  try {
    const results = await Promise.all(tasks)
    const last = results[results.length - 1]
    if (last) patchCartFromResponse(last)
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '批量更新失败',
      life: 2000,
    })
    loadCart()
  }
}

async function changeQty(item, qty) {
  if (!item?._id) return
  const nextQty = Math.max(1, Number(qty || 1))

  if (updatingIds.value.includes(item._id)) return
  updatingIds.value.push(item._id)

  try {
    const res = await apiUpdateCartItem(item._id, { qty: nextQty })
    patchCartFromResponse(res)
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '更新数量失败',
      life: 2000,
    })
  } finally {
    updatingIds.value = updatingIds.value.filter((id) => id !== item._id)
  }
}

async function removeItem(item) {
  if (!item?._id) return
  removingId.value = item._id
  try {
    const res = await apiRemoveCartItem(item._id)
    patchCartFromResponse(res)
    toast.add({
      severity: 'success',
      summary: '已移除商品',
      life: 1600,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '移除失败',
      life: 2000,
    })
  } finally {
    removingId.value = ''
  }
}

async function clearCart() {
  clearing.value = true
  try {
    const res = await apiClearCart()
    patchCartFromResponse(res)
    clearDialogVisible.value = false
    toast.add({
      severity: 'success',
      summary: '购物车已清空',
      life: 1600,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '清空失败',
      life: 2000,
    })
  } finally {
    clearing.value = false
  }
}

function goProductDetail(productId) {
  if (!productId) return
  router.push('/app/shop')
  toast.add({
    severity: 'info',
    summary: '已跳转商城',
    detail: '后续可扩展为直接打开商品详情页',
    life: 1800,
  })
}

async function checkout({ addressId } = {}) {
  if (checkedCount.value === 0) {
    toast.add({
      severity: 'warn',
      summary: '请先勾选要下单的商品',
      life: 1800,
    })
    return
  }

  if (!addressId) {
    toast.add({
      severity: 'warn',
      summary: '请选择收货地址',
      life: 1800,
    })
    return
  }

  creatingOrder.value = true
  try {
    await apiCreateOrderFromCart({ addressId })

    checkoutDialogVisible.value = false

    toast.add({
      severity: 'success',
      summary: '订单提交成功',
      detail: '已从购物车生成订单',
      life: 2200,
    })

    await Promise.all([loadCart(), loadAddresses()])
    router.push('/app/orders')
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

function openCheckoutDialog() {
  if (checkedCount.value === 0) {
    toast.add({
      severity: 'warn',
      summary: '请先勾选要下单的商品',
      life: 1800,
    })
    return
  }

  if (!addresses.value.length) {
    toast.add({
      severity: 'warn',
      summary: '请先在个人资料中添加收货地址',
      life: 2200,
    })
    return
  }

  checkoutDialogVisible.value = true
}
onMounted(() => {
  loadCart()
  loadAddresses()
})
</script>
