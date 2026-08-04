<template>
  <Card
    class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm overflow-hidden h-full"
  >
    <template #content>
      <div class="flex h-full flex-col">
        <button
          class="relative block overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800"
          @click="$emit('view', product)"
        >
          <img
            :src="mainImage"
            :alt="product?.title || '商品图片'"
            class="h-52 w-full object-cover transition duration-300 hover:scale-[1.03]"
          />
          <Tag
            v-if="product?.isOnSale"
            value="在售"
            severity="success"
            class="!absolute top-3 left-3"
          />
        </button>

        <div class="mt-4 flex-1 space-y-3">
          <div class="flex items-center gap-2 flex-wrap">
            <Tag severity="secondary" :value="categoryLabel" />
            <span v-if="product?.brand" class="text-xs text-gray-400">
              {{ product.brand }}
            </span>
          </div>

          <button class="block text-left w-full" @click="$emit('view', product)">
            <div class="line-clamp-2 text-base font-black text-gray-900 dark:text-gray-100">
              {{ product?.title || '未命名商品' }}
            </div>
          </button>

          <div v-if="product?.tags?.length" class="flex flex-wrap gap-2">
            <span
              v-for="tag in product.tags.slice(0, 3)"
              :key="tag"
              class="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700 dark:bg-green-500/10 dark:text-green-300"
            >
              {{ tag }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-3">
              <div class="text-[11px] text-gray-400">价格</div>
              <div class="mt-1 text-lg font-black text-green-700 dark:text-green-300">
                ¥{{ formatPrice(product?.price) }}
              </div>
            </div>

            <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-3">
              <div class="text-[11px] text-gray-400">库存 / 销量</div>
              <div class="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                {{ product?.stock ?? 0 }} / {{ product?.sales ?? 0 }}
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <Button
            label="查看详情"
            icon="pi pi-eye"
            severity="secondary"
            outlined
            class="flex-1"
            @click="$emit('view', product)"
          />
          <Button
            label="加入购物车"
            icon="pi pi-shopping-cart"
            class="flex-1"
            @click="$emit('add-cart', product)"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['view', 'add-cart'])

const mainImage = computed(() => {
  return props.product?.images?.[0] || 'https://placehold.co/600x400?text=Product'
})

const categoryLabel = computed(() => {
  const map = {
    seed: '种子',
    fertilizer: '化肥',
    pesticide: '农药',
  }
  return map[props.product?.category] || '其他'
})

function formatPrice(val) {
  const num = Number(val || 0)
  if (!Number.isFinite(num)) return '0.00'
  return num.toFixed(2)
}
</script>
