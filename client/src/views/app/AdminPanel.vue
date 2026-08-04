<template>
  <div class="min-h-[calc(100vh-64px)] p-4 md:p-6 space-y-6">
    <!-- 顶部 -->
    <section
      class="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800/70 bg-white/85 dark:bg-gray-900/50 backdrop-blur shadow-sm"
    >
      <div class="relative p-6 sm:p-8">
        <div class="absolute inset-0 pointer-events-none">
          <div
            class="absolute -top-24 -right-24 w-72 h-72 bg-red-200/30 dark:bg-red-900/20 rounded-full blur-[80px]"
          ></div>
          <div
            class="absolute -bottom-28 -left-28 w-72 h-72 bg-blue-200/20 dark:bg-blue-900/15 rounded-full blur-[90px]"
          ></div>
        </div>

        <div class="relative flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <div class="space-y-3">
            <div
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 text-red-700 dark:text-red-300 text-xs font-black shadow-sm"
            >
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              ADMIN PANEL
            </div>

            <h1
              class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100"
            >
              管理后台
            </h1>

            <p class="text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              管理商品信息与订单发货流程。
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <Button
              label="商品管理"
              icon="pi pi-shopping-bag"
              :severity="currentTab === 'products' ? 'danger' : 'secondary'"
              :outlined="currentTab !== 'products'"
              class="!rounded-full"
              @click="currentTab = 'products'"
            />
            <Button
              label="订单管理"
              icon="pi pi-receipt"
              :severity="currentTab === 'orders' ? 'danger' : 'secondary'"
              :outlined="currentTab !== 'orders'"
              class="!rounded-full"
              @click="currentTab = 'orders'"
            />
            <Button
              label="退出登录"
              icon="pi pi-sign-out"
              severity="contrast"
              outlined
              class="!rounded-full"
              @click="authStore.logout()"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 商品管理 -->
    <template v-if="currentTab === 'products'">
      <Card class="rounded-[2rem] border border-gray-100 dark:border-gray-800/70 shadow-sm">
        <template #content>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div class="lg:col-span-4">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                搜索商品
              </label>
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model.trim="productFilters.q"
                  class="w-full"
                  placeholder="输入商品名称"
                  @keyup.enter="loadProducts"
                />
              </IconField>
            </div>

            <div class="lg:col-span-3">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                商品分类
              </label>
              <Select
                v-model="productFilters.category"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                @update:modelValue="handleProductFilterChange"
              />
            </div>

            <div class="lg:col-span-3">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                排序方式
              </label>
              <Select
                v-model="productFilters.sort"
                :options="sortOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                @update:modelValue="handleProductFilterChange"
              />
            </div>

            <div class="lg:col-span-2 flex items-end gap-2">
              <Button label="新增" icon="pi pi-plus" class="w-full" @click="openCreateProduct" />
              <Button icon="pi pi-refresh" severity="secondary" outlined @click="loadProducts" />
            </div>
          </div>
        </template>
      </Card>

      <div v-if="loadingProducts" class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        <Skeleton v-for="n in 6" :key="n" height="290px" class="rounded-3xl" />
      </div>

      <div
        v-else-if="!products.length"
        class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/50 p-10 text-center shadow-sm"
      >
        <div class="text-lg font-black text-gray-900 dark:text-gray-100">暂无商品</div>
        <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">点击右上角新增商品。</div>
      </div>

      <div v-else class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        <Card
          v-for="item in products"
          :key="item._id"
          class="rounded-[2rem] border border-gray-100 dark:border-gray-800/70 shadow-sm overflow-hidden"
        >
          <template #content>
            <div class="space-y-4">
              <div class="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                <img
                  :src="resolveImageSrc(item.images?.[0])"
                  :alt="item.title"
                  class="h-48 w-full object-cover"
                  @error="handleImageError"
                />
              </div>

              <div class="space-y-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <Tag :value="categoryLabel(item.category)" severity="secondary" />
                  <Tag
                    :value="item.isOnSale ? '在售' : '下架'"
                    :severity="item.isOnSale ? 'success' : 'danger'"
                  />
                </div>

                <div class="text-lg font-black text-gray-900 dark:text-gray-100 line-clamp-2">
                  {{ item.title }}
                </div>

                <div class="text-sm text-gray-500 dark:text-gray-400">
                  品牌：{{ item.brand || '暂无' }}
                </div>

                <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in item.tags.slice(0, 4)"
                    :key="tag"
                    class="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700 dark:bg-green-500/10 dark:text-green-300"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-3">
                  <div class="text-[11px] text-gray-400">价格</div>
                  <div class="mt-1 text-base font-black text-green-700 dark:text-green-300">
                    ¥{{ formatPrice(item.price) }}
                  </div>
                </div>

                <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-3">
                  <div class="text-[11px] text-gray-400">库存</div>
                  <div class="mt-1 text-base font-black text-gray-900 dark:text-gray-100">
                    {{ item.stock ?? 0 }}
                  </div>
                </div>

                <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-3">
                  <div class="text-[11px] text-gray-400">销量</div>
                  <div class="mt-1 text-base font-black text-gray-900 dark:text-gray-100">
                    {{ item.sales ?? 0 }}
                  </div>
                </div>
              </div>

              <div class="flex gap-2">
                <Button
                  label="编辑"
                  icon="pi pi-pencil"
                  severity="secondary"
                  outlined
                  class="flex-1"
                  @click="openEditProduct(item)"
                />
                <Button
                  :label="item.isOnSale ? '下架' : '上架'"
                  :icon="item.isOnSale ? 'pi pi-eye-slash' : 'pi pi-eye'"
                  severity="contrast"
                  outlined
                  class="flex-1"
                  @click="toggleSaleStatus(item)"
                />
                <Button
                  label="删除"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  class="flex-1"
                  :loading="deletingProductId === item._id"
                  @click="confirmDeleteProduct(item)"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div v-if="productTotal > 0" class="flex justify-center">
        <Paginator
          :rows="productLimit"
          :totalRecords="productTotal"
          :first="(productPage - 1) * productLimit"
          @page="onProductPageChange"
          template="PrevPageLink PageLinks NextPageLink"
        />
      </div>
    </template>

    <!-- 订单管理 -->
    <template v-else>
      <Card class="rounded-[2rem] border border-gray-100 dark:border-gray-800/70 shadow-sm">
        <template #content>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div class="lg:col-span-4">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                订单状态
              </label>
              <Select
                v-model="orderStatus"
                :options="orderStatusOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                @update:modelValue="handleOrderFilterChange"
              />
            </div>

            <div class="lg:col-span-8 flex items-end justify-end gap-2">
              <Button
                label="刷新订单"
                icon="pi pi-refresh"
                severity="secondary"
                outlined
                :loading="loadingOrders"
                @click="loadAdminOrders"
              />
            </div>
          </div>
        </template>
      </Card>

      <div v-if="loadingOrders" class="space-y-4">
        <Skeleton v-for="n in 4" :key="n" height="180px" class="rounded-3xl" />
      </div>

      <div
        v-else-if="!adminOrders.length"
        class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/50 p-10 text-center shadow-sm"
      >
        <div class="text-lg font-black text-gray-900 dark:text-gray-100">暂无订单</div>
      </div>

      <div v-else class="space-y-4">
        <Card
          v-for="order in adminOrders"
          :key="order._id"
          class="rounded-[2rem] border border-gray-100 dark:border-gray-800/70 shadow-sm overflow-hidden"
        >
          <template #content>
            <div class="space-y-5">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-lg font-black text-gray-900 dark:text-gray-100 break-all">
                      {{ order._id }}
                    </span>
                    <Tag
                      :severity="orderStatusSeverity(order.status)"
                      :value="orderStatusLabel(order.status)"
                    />
                  </div>

                  <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    创建时间：{{ formatDateTime(order.createdAt) }}
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
                    <img :src="item.image" :alt="item.title" class="h-20 w-20 object-cover" />
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
                  v-if="order.status === 'pending'"
                  label="一键发货"
                  icon="pi pi-send"
                  severity="success"
                  @click="openShipDialog(order)"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div v-if="orderTotal > 0" class="flex justify-center">
        <Paginator
          :rows="orderLimit"
          :totalRecords="orderTotal"
          :first="(orderPage - 1) * orderLimit"
          @page="onOrderPageChange"
          template="PrevPageLink PageLinks NextPageLink"
        />
      </div>
    </template>

    <!-- 商品编辑弹窗 -->
    <Dialog
      v-model:visible="productDialogVisible"
      :header="isEditingProduct ? '编辑商品' : '新增商品'"
      modal
      class="w-[96vw] max-w-5xl"
    >
      <div class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              商品名称
            </label>
            <InputText
              v-model.trim="productForm.title"
              class="w-full"
              placeholder="请输入商品名称"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                商品分类
              </label>
              <Select
                v-model="productForm.category"
                :options="categoryOptions.filter((x) => x.value)"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                商品品牌
              </label>
              <InputText
                v-model.trim="productForm.brand"
                class="w-full"
                placeholder="例如：金海 / 史丹利"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                销售价格
              </label>
              <InputNumber
                v-model="productForm.price"
                class="w-full"
                inputClass="w-full"
                :min="0"
                :minFractionDigits="0"
                :maxFractionDigits="2"
                placeholder="请输入价格"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                库存数量
              </label>
              <InputNumber
                v-model="productForm.stock"
                class="w-full"
                inputClass="w-full"
                :min="0"
                :useGrouping="false"
                placeholder="请输入库存"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              商品标签
            </label>
            <InputText
              v-model="productForm.tagsText"
              class="w-full"
              placeholder="多个标签用中文逗号或英文逗号分隔，例如：高产，耐寒，促销"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                规格说明
              </label>
              <InputText
                v-model.trim="productForm.spec"
                class="w-full"
                placeholder="例如：50kg/袋、500ml/瓶"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                适用品类
              </label>
              <InputText
                v-model.trim="productForm.suitableFor"
                class="w-full"
                placeholder="例如：玉米、小麦、水稻"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              商品简介
            </label>
            <Textarea
              v-model="productForm.description"
              rows="5"
              class="w-full"
              placeholder="填写商品的核心卖点、用途或注意事项"
            />
          </div>

          <div class="flex items-center gap-2">
            <Checkbox v-model="productForm.isOnSale" binary inputId="isOnSale" />
            <label for="isOnSale" class="text-sm text-gray-700 dark:text-gray-200">
              立即上架销售
            </label>
          </div>
        </div>

        <div class="space-y-4">
          <div
            class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-gray-50 dark:bg-gray-800/50 p-5"
          >
            <div class="text-sm font-bold text-gray-900 dark:text-gray-100">商品图片上传</div>
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-6">
              支持两种方式：
              <br />
              1. 上传本地图片，系统会转成 base64 保存
              <br />
              2. 粘贴图片 URL，系统会直接保存 URL
            </div>

            <!-- 本地上传 -->
            <div class="mt-4">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                本地上传
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                class="block w-full text-sm text-gray-600 dark:text-gray-300"
                @change="onSelectProductImages"
              />
            </div>

            <!-- URL 上传 -->
            <div class="mt-5">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                图片 URL
              </label>
              <div class="flex gap-2">
                <InputText
                  v-model.trim="productForm.imageUrlInput"
                  class="w-full"
                  placeholder="请输入图片 URL"
                  @keyup.enter="addProductImageByUrl"
                />
                <Button
                  label="添加"
                  icon="pi pi-plus"
                  severity="secondary"
                  @click="addProductImageByUrl"
                />
              </div>
            </div>
          </div>

          <div v-if="productForm.images.length" class="grid grid-cols-2 gap-3">
            <div
              v-for="(img, idx) in productForm.images"
              :key="idx"
              class="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 relative"
            >
              <img :src="resolveImageSrc(img)" class="h-36 w-full object-cover" @error="handleImageError" />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                rounded
                class="!absolute top-1 right-1"
                @click="removeProductImage(idx)"
              />
            </div>
          </div>

          <div
            v-else
            class="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-8 text-center text-sm text-gray-400"
          >
            暂未上传图片
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="productDialogVisible = false" />
          <Button
            :label="isEditingProduct ? '保存修改' : '确认新增'"
            :loading="savingProduct"
            @click="submitProduct"
          />
        </div>
      </template>
    </Dialog>

    <!-- 发货弹窗 -->
    <Dialog v-model:visible="shipDialogVisible" header="订单发货" modal class="w-[94vw] max-w-xl">
      <div class="space-y-4">
        <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4">
          <div class="text-xs text-gray-400">订单号</div>
          <div class="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100 break-all">
            {{ shippingOrder?._id || '-' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            物流公司
          </label>
          <InputText
            v-model.trim="shipForm.carrier"
            class="w-full"
            placeholder="例如：顺丰 / 中通 / 京东物流"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            快递单号
          </label>
          <InputText v-model.trim="shipForm.trackingNo" class="w-full" placeholder="可选填写" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="shipDialogVisible = false" />
          <Button label="确认发货" severity="success" :loading="shipping" @click="submitShip" />
        </div>
      </template>
    </Dialog>

    <!-- 删除确认 -->
    <Dialog
      v-model:visible="deleteProductDialogVisible"
      header="确认删除商品"
      modal
      class="w-[92vw] max-w-sm"
    >
      <div class="text-sm text-gray-600 dark:text-gray-300 leading-6">
        将删除商品
        <span class="font-bold text-gray-900 dark:text-gray-100">
          {{ deletingProduct?.title || '' }}
        </span>
        ，是否继续？
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="deleteProductDialogVisible = false" />
          <Button
            label="确认删除"
            severity="danger"
            :loading="!!deletingProductId"
            @click="removeProduct"
          />
        </div>
      </template>
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
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import Skeleton from 'primevue/skeleton'
import Paginator from 'primevue/paginator'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

import { useAuthStore } from '@/stores/auth'
import {
  apiGetProducts,
  apiAdminCreateProduct,
  apiAdminUpdateProduct,
  apiAdminDeleteProduct,
} from '@/api/products.api'
import { apiAdminGetOrders, apiAdminShipOrder } from '@/api/adminOrders.api'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const currentTab = ref('products')

/* 商品 */
const loadingProducts = ref(false)
const savingProduct = ref(false)
const deletingProductId = ref('')
const products = ref([])
const productPage = ref(1)
const productLimit = ref(12)
const productTotal = ref(0)

const productFilters = ref({
  q: '',
  category: '',
  sort: 'new',
})

const categoryOptions = [
  { label: '全部分类', value: '' },
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

const productDialogVisible = ref(false)
const isEditingProduct = ref(false)
const editingProductId = ref('')
const deleteProductDialogVisible = ref(false)
const deletingProduct = ref(null)

const productForm = ref({
  title: '',
  category: 'seed',
  price: null,
  stock: 0,
  brand: '',
  images: [],
  imageUrlInput: '',
  tagsText: '',
  spec: '',
  suitableFor: '',
  description: '',
  isOnSale: true,
})

/* 订单 */
const loadingOrders = ref(false)
const shipping = ref(false)
const adminOrders = ref([])
const orderPage = ref(1)
const orderLimit = ref(15)
const orderTotal = ref(0)
const orderStatus = ref('')

const orderStatusOptions = [
  { label: '全部状态', value: '' },
  { label: '待处理', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
]

const shipDialogVisible = ref(false)
const shippingOrder = ref(null)
const shipForm = ref({
  carrier: '物流',
  trackingNo: '',
})

function categoryLabel(category) {
  const map = {
    seed: '种子',
    fertilizer: '化肥',
    pesticide: '农药',
  }
  return map[category] || '其他'
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

function formatPrice(val) {
  const num = Number(val || 0)
  if (!Number.isFinite(num)) return '0.00'
  return num.toFixed(2)
}

function resolveImageSrc(src) {

  if (!src) return 'https://placehold.co/600x400?text=Product'

  const value = String(src).trim()

  // base64
  if (value.startsWith('data:image/')) {
    return value
  }

  // 完整 URL
  if (/^https?:\/\//i.test(value)) {
    return value
  }

  // 协议相对地址
  if (value.startsWith('//')) {
    return `https:${value}`
  }

  // 裸域名或 www 开头，自动补协议
  if (/^(www\.)/i.test(value)) {
    return `https://${value}`
  }

  return value
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
  return [
    addr?.receiver,
    addr?.phone,
    [addr?.province, addr?.city, addr?.district, addr?.detail].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(' ｜ ')
}

function resetProductForm() {
  productForm.value = {
    title: '',
    category: 'seed',
    price: null,
    stock: 0,
    brand: '',
    images: [],
    imageUrlInput: '',
    tagsText: '',
    spec: '',
    suitableFor: '',
    description: '',
    isOnSale: true,
  }
}

function buildAttributesFromForm() {
  return {
    spec: productForm.value.spec?.trim() || '',
    suitableFor: productForm.value.suitableFor?.trim() || '',
    description: productForm.value.description?.trim() || '',
  }
}

function fillFormFromAttributes(attrs = {}) {
  productForm.value.spec = attrs?.spec || ''
  productForm.value.suitableFor = attrs?.suitableFor || ''
  productForm.value.description = attrs?.description || ''
}

function handleImageError(event) {
  event.target.src = 'https://placehold.co/600x400?text=Image+Error'
}

async function loadProducts() {
  loadingProducts.value = true
  try {
    const params = {
      page: productPage.value,
      limit: productLimit.value,
      sort: productFilters.value.sort,
      onSale: '',
    }

    if (productFilters.value.q) params.q = productFilters.value.q
    if (productFilters.value.category) params.category = productFilters.value.category

    const res = await apiGetProducts(params)
    const data = res?.data || {}

    products.value = Array.isArray(data.items) ? data.items : []
    productTotal.value = Number(data.total || 0)
    productPage.value = Number(data.page || 1)
    productLimit.value = Number(data.limit || 12)
  } catch (e) {
    products.value = []
    productTotal.value = 0
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '获取商品失败',
      life: 2200,
    })
  } finally {
    loadingProducts.value = false
  }
}

function handleProductFilterChange() {
  productPage.value = 1
  loadProducts()
}

function onProductPageChange(event) {
  productPage.value = Math.floor(event.first / event.rows) + 1
  productLimit.value = event.rows
  loadProducts()
}

function openCreateProduct() {
  isEditingProduct.value = false
  editingProductId.value = ''
  resetProductForm()
  productDialogVisible.value = true
}

function openEditProduct(item) {
  isEditingProduct.value = true
  editingProductId.value = item._id
  productForm.value = {
    title: item.title || '',
    category: item.category || 'seed',
    price: Number(item.price || 0),
    stock: Number(item.stock || 0),
    brand: item.brand || '',
    images: Array.isArray(item.images) ? [...item.images] : [],
    imageUrlInput: '',
    tagsText: Array.isArray(item.tags) ? item.tags.join('，') : '',
    spec: '',
    suitableFor: '',
    description: '',
    isOnSale: Boolean(item.isOnSale),
  }
  fillFormFromAttributes(item.attributes || {})
  productDialogVisible.value = true
}

async function fileToDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function onSelectProductImages(event) {
  const files = Array.from(event.target.files || [])
  if (!files.length) return

  try {
    const urls = await Promise.all(files.map(fileToDataUrl))
    productForm.value.images.push(...urls)
  } catch {
    toast.add({
      severity: 'error',
      summary: '图片处理失败',
      life: 2000,
    })
  } finally {
    event.target.value = ''
  }
}

function removeProductImage(idx) {
  productForm.value.images.splice(idx, 1)
}

function addProductImageByUrl() {
  const url = productForm.value.imageUrlInput?.trim()
  if (!url) return

  if (!/^https?:\/\//i.test(url)) {
    toast.add({
      severity: 'warn',
      summary: '图片链接格式不正确',
      detail: '请输入以 http:// 或 https:// 开头的图片地址',
      life: 2200,
    })
    return
  }

  if (!productForm.value.images.includes(url)) {
    productForm.value.images.push(url)
  }

  productForm.value.imageUrlInput = ''
}

async function submitProduct() {
  if (
    !productForm.value.title.trim() ||
    !productForm.value.category ||
    productForm.value.price === null
  ) {
    toast.add({
      severity: 'warn',
      summary: '请填写完整商品信息',
      life: 1800,
    })
    return
  }

  const payload = {
    title: productForm.value.title.trim(),
    category: productForm.value.category,
    price: Number(productForm.value.price || 0),
    stock: Number(productForm.value.stock || 0),
    brand: productForm.value.brand?.trim() || '',
    images: productForm.value.images || [],
    tags: productForm.value.tagsText
      ? productForm.value.tagsText
          .split(/[,，]/)
          .map((x) => x.trim())
          .filter(Boolean)
      : [],
    attributes: buildAttributesFromForm(),
    isOnSale: Boolean(productForm.value.isOnSale),
  }

  savingProduct.value = true
  try {
    if (isEditingProduct.value) {
      await apiAdminUpdateProduct(editingProductId.value, payload)
      toast.add({
        severity: 'success',
        summary: '商品已更新',
        life: 1600,
      })
    } else {
      await apiAdminCreateProduct(payload)
      toast.add({
        severity: 'success',
        summary: '商品已创建',
        life: 1600,
      })
    }

    productDialogVisible.value = false
    await loadProducts()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '保存商品失败',
      life: 2200,
    })
  } finally {
    savingProduct.value = false
  }
}

async function toggleSaleStatus(item) {
  try {
    await apiAdminUpdateProduct(item._id, {
      isOnSale: !item.isOnSale,
    })
    toast.add({
      severity: 'success',
      summary: item.isOnSale ? '商品已下架' : '商品已上架',
      life: 1600,
    })
    await loadProducts()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '更新状态失败',
      life: 2200,
    })
  }
}

function confirmDeleteProduct(item) {
  deletingProduct.value = item
  deleteProductDialogVisible.value = true
}

async function removeProduct() {
  if (!deletingProduct.value?._id) return

  deletingProductId.value = deletingProduct.value._id
  try {
    await apiAdminDeleteProduct(deletingProduct.value._id)
    toast.add({
      severity: 'success',
      summary: '商品已删除',
      life: 1600,
    })
    deleteProductDialogVisible.value = false
    deletingProduct.value = null
    await loadProducts()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '删除商品失败',
      life: 2200,
    })
  } finally {
    deletingProductId.value = ''
  }
}

async function loadAdminOrders() {
  loadingOrders.value = true
  try {
    const params = {
      page: orderPage.value,
      limit: orderLimit.value,
    }
    if (orderStatus.value) params.status = orderStatus.value

    const res = await apiAdminGetOrders(params)
    const data = res?.data || {}

    adminOrders.value = Array.isArray(data.items) ? data.items : []
    orderTotal.value = Number(data.total || 0)
    orderPage.value = Number(data.page || 1)
    orderLimit.value = Number(data.limit || 15)
  } catch (e) {
    adminOrders.value = []
    orderTotal.value = 0
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '获取订单失败',
      life: 2200,
    })
  } finally {
    loadingOrders.value = false
  }
}

function handleOrderFilterChange() {
  orderPage.value = 1
  loadAdminOrders()
}

function onOrderPageChange(event) {
  orderPage.value = Math.floor(event.first / event.rows) + 1
  orderLimit.value = event.rows
  loadAdminOrders()
}

function openShipDialog(order) {
  shippingOrder.value = order
  shipForm.value = {
    carrier: '物流',
    trackingNo: '',
  }
  shipDialogVisible.value = true
}

async function submitShip() {
  if (!shippingOrder.value?._id) return

  shipping.value = true
  try {
    await apiAdminShipOrder(shippingOrder.value._id, {
      carrier: shipForm.value.carrier?.trim() || '物流',
      trackingNo: shipForm.value.trackingNo?.trim() || '',
    })

    toast.add({
      severity: 'success',
      summary: '发货成功',
      detail: '已通知用户',
      life: 1800,
    })

    shipDialogVisible.value = false
    shippingOrder.value = null
    await loadAdminOrders()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '发货失败',
      life: 2200,
    })
  } finally {
    shipping.value = false
  }
}

onMounted(async () => {
  if (authStore.user?.role !== 'admin') {
    toast.add({
      severity: 'error',
      summary: '无权限访问',
      detail: '该页面仅管理员可进入',
      life: 2200,
    })
    router.replace('/app/dashboard')
    return
  }

  await Promise.all([loadProducts(), loadAdminOrders()])
})
</script>
