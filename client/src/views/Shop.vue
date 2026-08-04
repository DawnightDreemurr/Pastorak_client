<template>
  <div class="min-h-[calc(100vh-64px)] p-4 md:p-6 space-y-6">
    <section class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">农资商城</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          浏览种子、化肥、农药等农资商品。
        </p>
      </div>
    </section>

    <!-- 筛选栏 -->
    <Card class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
      <template #content>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div class="lg:col-span-4">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              搜索商品
            </label>
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText
                v-model.trim="filters.q"
                class="w-full"
                placeholder="输入商品名称"
                @keyup.enter="handleSearch"
              />
            </IconField>
          </div>

          <div class="lg:col-span-3">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              商品分类
            </label>
            <Select
              v-model="filters.category"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              placeholder="全部分类"
              @update:modelValue="handleFilterChange"
            />
          </div>

          <div class="lg:col-span-3">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              排序方式
            </label>
            <Select
              v-model="filters.sort"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              @update:modelValue="handleFilterChange"
            />
          </div>

          <div class="lg:col-span-2 flex items-end gap-2">
            <Button label="搜索" icon="pi pi-search" class="w-full" @click="handleSearch" />
            <Button icon="pi pi-refresh" severity="secondary" outlined @click="resetFilters" />
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <Button
            v-for="item in quickCategories"
            :key="item.value"
            :label="item.label"
            size="small"
            :severity="filters.category === item.value ? 'success' : 'secondary'"
            :outlined="filters.category !== item.value"
            class="!rounded-full"
            @click="setCategory(item.value)"
          />
        </div>
      </template>
    </Card>

    <!-- 商品列表 -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
    >
      <Skeleton v-for="n in 8" :key="n" height="340px" class="rounded-3xl" />
    </div>

    <div
      v-else-if="!products.length"
      class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/50 p-10 text-center shadow-sm"
    >
      <div class="text-lg font-black text-gray-900 dark:text-gray-100">暂无商品</div>
      <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">换个筛选条件试试看。</div>
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between gap-3">
        <div class="text-sm text-gray-500 dark:text-gray-400">共 {{ total }} 件商品</div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        <ProductCard
          v-for="item in products"
          :key="item._id"
          :product="item"
          @view="openDetail"
          @add-cart="addToCart"
        />
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

    <ProductDetailDialog v-model:visible="detailVisible" :product-id="currentProductId" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Skeleton from 'primevue/skeleton'
import Paginator from 'primevue/paginator'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

import { apiGetProducts } from '@/api/products.api'
import { apiAddCartItem } from '@/api/cart.api'

import ProductCard from '@/components/shop/ProductCard.vue'
import ProductDetailDialog from '@/components/shop/ProductDetailDialog.vue'

const toast = useToast()

const loading = ref(false)
const products = ref([])
const total = ref(0)
const page = ref(1)
const limit = ref(12)

const detailVisible = ref(false)
const currentProductId = ref('')

const filters = ref({
  category: '',
  q: '',
  sort: 'new',
})

const categoryOptions = [
  { label: '全部分类', value: '' },
  { label: '种子', value: 'seed' },
  { label: '化肥', value: 'fertilizer' },
  { label: '农药', value: 'pesticide' },
]

const quickCategories = [
  { label: '全部', value: '' },
  { label: '种子', value: 'seed' },
  { label: '化肥', value: 'fertilizer' },
  { label: '农药', value: 'pesticide' },
]

const sortOptions = [
  { label: '最新上架', value: 'new' },
  { label: '价格从低到高', value: 'priceAsc' },
  { label: '价格从高到低', value: 'priceDesc' },
  { label: '销量优先', value: 'sales' },
]

async function loadProducts() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: limit.value,
      sort: filters.value.sort,
      onSale: 1,
    }

    if (filters.value.category) params.category = filters.value.category
    if (filters.value.q) params.q = filters.value.q

    const res = await apiGetProducts(params)
    const data = res?.data || {}

    products.value = Array.isArray(data.items) ? data.items : []
    total.value = Number(data.total || 0)
    page.value = Number(data.page || 1)
    limit.value = Number(data.limit || 12)
  } catch (e) {
    products.value = []
    total.value = 0
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '获取商品失败',
      life: 2200,
    })
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  loadProducts()
}

function handleFilterChange() {
  page.value = 1
  loadProducts()
}

function setCategory(category) {
  filters.value.category = category
  page.value = 1
  loadProducts()
}

function resetFilters() {
  filters.value = {
    category: '',
    q: '',
    sort: 'new',
  }
  page.value = 1
  loadProducts()
}

function onPageChange(event) {
  page.value = Math.floor(event.first / event.rows) + 1
  limit.value = event.rows
  loadProducts()
}

function openDetail(product) {
  currentProductId.value = product?._id || ''
  detailVisible.value = true
}
async function addToCart(product) {
  if (!product?._id) return

  try {
    await apiAddCartItem({
      productId: product._id,
      qty: 1,
    })

    toast.add({
      severity: 'success',
      summary: '已加入购物车',
      life: 1600,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '加入购物车失败',
      life: 2200,
    })
  }
}

onMounted(() => {
  loadProducts()
})
</script>
