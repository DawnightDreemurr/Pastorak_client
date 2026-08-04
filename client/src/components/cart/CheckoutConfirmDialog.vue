<template>
  <Dialog
    :visible="visible"
    modal
    header="确认下单"
    class="w-[95vw] max-w-5xl"
    :draggable="false"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
      <!-- 左侧：订单确认 -->
      <div class="space-y-5">
        <!-- 顶部摘要 -->
        <div
          class="rounded-3xl overflow-hidden border border-green-200/70 dark:border-green-800/40 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-gray-900 dark:to-emerald-950/10"
        >
          <div
            class="p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div
                class="text-xs font-black tracking-wider uppercase text-green-700 dark:text-green-300"
              >
                Order Summary
              </div>
              <div class="mt-2 text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
                ¥{{ formatPrice(totalAmount) }}
              </div>
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                本次共下单 {{ checkedCount }} 件商品
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 min-w-[220px]">
              <div
                class="rounded-2xl bg-white/80 dark:bg-gray-900/50 p-4 border border-white/70 dark:border-gray-800/70"
              >
                <div class="text-xs text-gray-400">商品件数</div>
                <div class="mt-1 text-lg font-black text-gray-900 dark:text-gray-100">
                  {{ checkedCount }}
                </div>
              </div>
              <div
                class="rounded-2xl bg-white/80 dark:bg-gray-900/50 p-4 border border-white/70 dark:border-gray-800/70"
              >
                <div class="text-xs text-gray-400">支付方式</div>
                <div class="mt-1 text-lg font-black text-green-700 dark:text-green-300">微信</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 地址选择 -->
        <div
          class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-900/40 p-5 md:p-6 shadow-sm"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-lg font-extrabold text-gray-900 dark:text-gray-100">收货地址</div>
              <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                请确认本次订单的收货信息准确无误
              </div>
            </div>
          </div>

          <div class="mt-4">
            <Select
              v-model="selectedAddressId"
              :options="addressOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              placeholder="请选择收货地址"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="w-full">
                  <div
                    class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-200/70 dark:border-gray-700/70"
                  >
                    <div class="font-bold text-gray-900 dark:text-gray-100">
                      {{ currentAddress?.receiver }} ｜ {{ currentAddress?.phone }}
                    </div>
                    <div class="mt-1 text-sm text-gray-600 dark:text-gray-300 break-words">
                      {{ formatAddress(currentAddress) }}
                    </div>
                    <div v-if="currentAddress?.isDefault" class="mt-2">
                      <span
                        class="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700 dark:bg-green-500/15 dark:text-green-300"
                      >
                        默认地址
                      </span>
                    </div>
                  </div>
                </div>
                <span v-else class="text-gray-400">请选择收货地址</span>
              </template>

              <template #option="slotProps">
                <div class="py-1">
                  <div class="font-bold text-gray-900 dark:text-gray-100">
                    {{ slotProps.option.raw.receiver }} ｜ {{ slotProps.option.raw.phone }}
                  </div>
                  <div class="mt-1 text-sm text-gray-500 dark:text-gray-400 break-words">
                    {{ formatAddress(slotProps.option.raw) }}
                  </div>
                  <div v-if="slotProps.option.raw.isDefault" class="mt-2">
                    <span
                      class="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700 dark:bg-green-500/15 dark:text-green-300"
                    >
                      默认地址
                    </span>
                  </div>
                </div>
              </template>
            </Select>
          </div>
        </div>

        <!-- 下单说明 -->
        <div
          class="rounded-3xl border border-amber-200/70 dark:border-amber-800/40 bg-amber-50/80 dark:bg-amber-900/10 p-5 md:p-6"
        >
          <div class="flex items-center gap-2">
            <i class="pi pi-info-circle text-amber-600 dark:text-amber-300"></i>
            <div class="text-lg font-extrabold text-amber-800 dark:text-amber-200">下单须知</div>
          </div>

          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="rounded-2xl bg-white/70 dark:bg-gray-900/30 p-4">
              <div class="text-sm font-bold text-amber-800 dark:text-amber-200">地址确认</div>
              <div class="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-100/90">
                请确认收件人、电话和详细地址正确，以免影响配送。
              </div>
            </div>

            <div class="rounded-2xl bg-white/70 dark:bg-gray-900/30 p-4">
              <div class="text-sm font-bold text-amber-800 dark:text-amber-200">付款方式</div>
              <div class="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-100/90">
                请使用右侧微信收款码支付，支付完成后再提交订单。
              </div>
            </div>

            <div class="rounded-2xl bg-white/70 dark:bg-gray-900/30 p-4">
              <div class="text-sm font-bold text-amber-800 dark:text-amber-200">人工确认</div>
              <div class="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-100/90">
                订单提交后将由管理员人工核验并安排发货。
              </div>
            </div>

            <div class="rounded-2xl bg-white/70 dark:bg-gray-900/30 p-4">
              <div class="text-sm font-bold text-amber-800 dark:text-amber-200">售后沟通</div>
              <div class="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-100/90">
                若付款、发货或商品信息有疑问，请及时联系管理员。
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：二维码 -->
      <div class="space-y-5">
        <div
          class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-900/40 shadow-sm overflow-hidden"
        >
          <div class="p-5 md:p-6 border-b border-gray-100 dark:border-gray-800/70">
            <div class="text-lg font-extrabold text-gray-900 dark:text-gray-100">微信收款码</div>
            <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              请先扫码支付，再点击确认提交订单
            </div>
          </div>

          <div class="p-5 md:p-6">
            <div
              class="rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/70 dark:to-gray-900/50 p-5 border border-gray-200/70 dark:border-gray-700/70"
            >
              <div class="flex justify-center">
                <img
                  :src="qrCodeImg"
                  alt="微信收款码"
                  class="w-full max-w-[320px] rounded-2xl border border-gray-200 dark:border-gray-700 object-contain shadow-sm"
                />
              </div>

              <div class="mt-4 text-center">
                <div class="text-sm font-bold text-gray-900 dark:text-gray-100">扫码完成付款</div>
                <div class="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-6">
                  建议付款后截图留存，便于后续核对订单
                </div>
              </div>
            </div>

            <div
              class="mt-4 rounded-2xl bg-green-50 dark:bg-green-500/10 p-4 border border-green-200/60 dark:border-green-800/30"
            >
              <div class="flex items-start gap-3">
                <i class="pi pi-shield text-green-600 dark:text-green-300 mt-0.5"></i>
                <div>
                  <div class="text-sm font-bold text-green-800 dark:text-green-200">
                    提交前请确认
                  </div>
                  <div class="mt-1 text-sm leading-6 text-green-900/80 dark:text-green-100/90">
                    已完成付款，并确认本次订单金额、收货地址及联系方式无误。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-3xl bg-gray-50 dark:bg-gray-800/60 p-5 border border-gray-200/70 dark:border-gray-700/70"
        >
          <div class="text-xs text-gray-400">温馨提示</div>
          <div class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            若当前没有可用地址，请先前往“个人资料”页面新增收货地址后再下单。
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div
        class="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 w-full"
      >
        <div class="text-xs text-gray-400">提交订单即表示你已确认本次支付与收货信息</div>

        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="$emit('update:visible', false)" />
          <Button
            label="确认提交订单"
            icon="pi pi-check"
            :loading="submitting"
            @click="handleConfirm"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Select from 'primevue/select'

import qrCodeImg from '@/assets/QRcode.jpg'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  addresses: {
    type: Array,
    default: () => [],
  },
  checkedCount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible', 'confirm'])

const selectedAddressId = ref('')

const addressOptions = computed(() => {
  return (props.addresses || []).map((addr) => ({
    value: addr._id,
    label: `${addr.receiver}｜${addr.phone}｜${[addr.province, addr.city, addr.district, addr.detail].filter(Boolean).join(' ')}`,
    raw: addr,
  }))
})

const currentAddress = computed(() => {
  return (props.addresses || []).find((x) => x._id === selectedAddressId.value) || null
})

watch(
  () => props.visible,
  (visible) => {
    if (!visible) return
    const defaultAddr = props.addresses?.find((x) => x.isDefault)
    selectedAddressId.value = defaultAddr?._id || props.addresses?.[0]?._id || ''
  },
  { immediate: true },
)

function formatPrice(val) {
  const num = Number(val || 0)
  if (!Number.isFinite(num)) return '0.00'
  return num.toFixed(2)
}

function formatAddress(addr) {
  return [addr?.province, addr?.city, addr?.district, addr?.detail].filter(Boolean).join(' ')
}

function handleConfirm() {
  emit('confirm', { addressId: selectedAddressId.value })
}
</script>
