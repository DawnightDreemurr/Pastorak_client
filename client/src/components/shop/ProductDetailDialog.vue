<template>
  <Dialog
    :visible="visible"
    modal
    class="w-[96vw] max-w-5xl"
    header="商品详情"
    @update:visible="$emit('update:visible', $event)"
  >
    <!-- loading -->
    <div v-if="loading" class="space-y-4">
      <Skeleton height="260px" class="rounded-2xl" />
      <Skeleton height="180px" class="rounded-2xl" />
    </div>

    <div v-else-if="product" class="space-y-6">
      <!-- 🔹 上部 -->
      <div class="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
        <!-- 左：图片 -->
        <div class="space-y-3">
          <div class="rounded-2xl overflow-hidden bg-gray-100 group">
            <img
              :src="mainImage"
              :alt="product.title"
              class="w-full h-[320px] object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          <div v-if="product.images?.length > 1" class="flex gap-2 overflow-x-auto">
            <img
              v-for="(img, idx) in product.images"
              :key="idx"
              :src="img"
              @click="activeImage = img"
              class="w-16 h-16 object-cover rounded-xl cursor-pointer border-2 transition"
              :class="
                activeImage === img
                  ? 'border-green-500 scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              "
            />
          </div>
        </div>

        <!-- 右：信息 -->
        <div class="flex flex-col justify-between">
          <div class="space-y-5">
            <!-- 标题 -->
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
              {{ product.title }}
            </div>

            <!-- 分类 + 品牌 -->
            <div class="text-sm text-gray-400 flex gap-4">
              <span>{{ categoryLabel }}</span>
              <span>品牌：{{ product.brand || '暂无' }}</span>
            </div>

            <!-- 🔥 价格（电商重点） -->
            <div
              class="rounded-2xl px-5 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
            >
              <div class="text-xs opacity-80">售价</div>
              <div class="text-4xl font-black mt-1 tracking-wide">
                ¥{{ formatPrice(product.price) }}
              </div>
            </div>

            <!-- 状态 -->
            <div class="flex items-center gap-2">
              <Tag severity="secondary" :value="categoryLabel" />
              <Tag v-if="product.isOnSale" severity="success" value="在售" />
            </div>

            <!-- 数据（更轻卡片感） -->
            <div class="flex gap-4">
              <div class="flex-1 rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
                <div class="text-xs text-gray-400">库存</div>
                <div class="text-lg font-bold mt-1">
                  {{ product.stock ?? 0 }}
                </div>
              </div>

              <div class="flex-1 rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
                <div class="text-xs text-gray-400">销量</div>
                <div class="text-lg font-bold mt-1">
                  {{ product.sales ?? 0 }}
                </div>
              </div>
            </div>

            <!-- 标签 -->
            <div v-if="product.tags?.length" class="flex flex-wrap gap-2">
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="attributeEntries.length"
        class="rounded-2xl overflow-hidden bg-gray-50/60 dark:bg-gray-800/40"
      >
        <!-- 标题 -->
        <div class="px-5 py-3 bg-gray-50 dark:bg-gray-800 text-sm font-semibold">商品参数</div>

        <!-- 内容 -->
        <div class="grid sm:grid-cols-2">
          <div
            v-for="([key, value], idx) in attributeEntries"
            :key="key"
            class="flex justify-between px-5 py-3 text-sm border-b border-gray-200/60 dark:border-gray-700/60 sm:border-r last:border-r-0"
            :class="
              idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/60 dark:bg-gray-800/40'
            "
          >
            <span class="text-gray-400">
              {{ key }}
            </span>

            <span
              class="text-gray-900 dark:text-gray-100 font-medium text-right max-w-[60%] break-words"
            >
              {{ formatAttrValue(value) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-10 text-center text-gray-500">商品详情获取失败</div>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'

import { apiGetProductById } from '@/api/products.api'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  productId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:visible'])

const loading = ref(false)
const product = ref(null)
const activeImage = ref('')

const mainImage = computed(() => {
  return (
    activeImage.value || product.value?.images?.[0] || 'https://placehold.co/800x500?text=Product'
  )
})

const categoryLabel = computed(() => {
  const map = {
    seed: '种子',
    fertilizer: '化肥',
    pesticide: '农药',
  }
  return map[product.value?.category] || '其他'
})

const attributeEntries = computed(() => {
  const attrs = product.value?.attributes
  if (!attrs || typeof attrs !== 'object') return []
  return Object.entries(attrs)
})

async function loadDetail() {
  if (!props.productId) return
  loading.value = true
  try {
    const res = await apiGetProductById(props.productId)
    product.value = res?.data || null
    activeImage.value = product.value?.images?.[0] || ''
  } catch {
    product.value = null
    activeImage.value = ''
  } finally {
    loading.value = false
  }
}

function formatPrice(val) {
  const num = Number(val || 0)
  if (!Number.isFinite(num)) return '0.00'
  return num.toFixed(2)
}

function formatAttrValue(value) {
  if (Array.isArray(value)) return value.join('、')
  if (value && typeof value === 'object') return JSON.stringify(value)
  return String(value ?? '')
}

watch(
  () => [props.visible, props.productId],
  ([visible]) => {
    if (visible && props.productId) {
      loadDetail()
    }
  },
  { immediate: true },
)
</script>
