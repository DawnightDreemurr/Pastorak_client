<template>
  <div class="min-h-[calc(100vh-64px)] p-4 md:p-6 space-y-6">
    <section>
      <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">个人信息</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">管理你的基础资料和收货地址。</p>
    </section>

    <div class="space-y-6">
      <!-- 基础资料 -->
      <Card class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
        <template #content>
          <div class="space-y-6">
            <div>
              <div class="text-lg font-extrabold text-gray-900 dark:text-gray-100">基础资料</div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                修改昵称、头像和默认地区（用于天气预报）
              </div>
            </div>

            <div class="flex flex-col md:flex-row gap-5 md:items-start">
              <div class="shrink-0">
                <div
                  class="h-24 w-24 md:h-28 md:w-28 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm"
                >
                  <img :src="currentAvatarSrc" alt="avatar" class="h-full w-full object-cover" />
                </div>
              </div>

              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    昵称
                  </label>
                  <InputText v-model="profileForm.name" class="w-full" placeholder="请输入昵称" />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    头像
                  </label>

                  <div class="grid grid-cols-3 gap-3">
                    <button
                      v-for="item in avatarOptions"
                      :key="item.value"
                      type="button"
                      class="group relative rounded-2xl border p-3 transition-all duration-200"
                      :class="
                        profileForm.avatarKey === item.value
                          ? 'border-green-500 bg-green-50 dark:bg-green-500/10 ring-2 ring-green-500/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 hover:border-green-400 hover:bg-green-50/60 dark:hover:bg-green-500/5'
                      "
                      @click="profileForm.avatarKey = item.value"
                    >
                      <div class="flex flex-col items-center gap-2">
                        <img
                          :src="item.img"
                          :alt="item.label"
                          class="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <span
                          class="text-xs font-semibold"
                          :class="
                            profileForm.avatarKey === item.value
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-gray-600 dark:text-gray-300'
                          "
                        >
                          {{ item.label }}
                        </span>
                      </div>

                      <i
                        v-if="profileForm.avatarKey === item.value"
                        class="pi pi-check-circle absolute top-2 right-2 text-green-500"
                      ></i>
                    </button>
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    默认地区
                  </label>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Select
                      v-model="defaultRegion.provinceCode"
                      :options="defaultProvinceOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full"
                      placeholder="选择省"
                      @update:modelValue="onDefaultProvinceChange"
                    />
                    <Select
                      v-model="defaultRegion.cityCode"
                      :options="defaultCityOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full"
                      placeholder="选择市"
                      :disabled="!defaultRegion.provinceCode"
                      @update:modelValue="onDefaultCityChange"
                    />
                    <Select
                      v-model="defaultRegion.districtCode"
                      :options="defaultDistrictOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full"
                      placeholder="选择区 / 县"
                      :disabled="!defaultRegion.cityCode"
                    />
                  </div>

                  <div class="mt-2 text-xs text-gray-400 break-all">
                    当前默认地区代码：{{ profileForm.defaultLocation || '未选择' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <Button
                label="保存资料"
                icon="pi pi-save"
                :loading="savingProfile"
                @click="updateProfile"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- 收货地址 -->
      <Card class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
        <template #content>
          <div class="space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div class="text-lg font-extrabold text-gray-900 dark:text-gray-100">收货地址</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1"></div>
              </div>

              <Button label="新增地址" icon="pi pi-plus" @click="openCreateDialog" />
            </div>

            <div
              v-if="!addresses.length"
              class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-6 text-sm text-gray-500 dark:text-gray-400 text-center"
            >
              暂无收货地址，点击“新增地址”开始添加。
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="addr in addresses"
                :key="addr._id"
                class="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 p-4 bg-white dark:bg-gray-900/40"
              >
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-base font-bold text-gray-900 dark:text-gray-100">
                        {{ addr.receiver }}
                      </span>
                      <Tag v-if="addr.isDefault" value="默认地址" severity="success" />
                    </div>

                    <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {{ addr.phone }}
                    </div>

                    <div
                      class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300 break-words"
                    >
                      {{ formatAddress(addr) }}
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    <Button
                      label="编辑"
                      icon="pi pi-pencil"
                      severity="secondary"
                      size="small"
                      @click="openEditDialog(addr)"
                    />
                    <Button
                      v-if="!addr.isDefault"
                      label="设为默认"
                      icon="pi pi-check"
                      severity="success"
                      size="small"
                      :loading="defaultingId === addr._id"
                      @click="setAsDefault(addr)"
                    />
                    <Button
                      label="删除"
                      icon="pi pi-trash"
                      severity="danger"
                      size="small"
                      :loading="deletingId === addr._id"
                      @click="removeAddress(addr)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 地址弹窗 -->
    <Dialog
      v-model:visible="addressDialogVisible"
      :header="isEditingAddress ? '编辑地址' : '新增地址'"
      modal
      class="w-[94vw] sm:w-[42rem]"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              收件人
            </label>
            <InputText v-model="addressForm.receiver" class="w-full" placeholder="请输入收件人" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              联系电话
            </label>
            <InputText v-model="addressForm.phone" class="w-full" placeholder="请输入联系电话" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              所在地区
            </label>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select
                v-model="addressRegion.provinceCode"
                :options="addressProvinceOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                placeholder="选择省"
                @update:modelValue="onAddressProvinceChange"
              />
              <Select
                v-model="addressRegion.cityCode"
                :options="addressCityOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                placeholder="选择市"
                :disabled="!addressRegion.provinceCode"
                @update:modelValue="onAddressCityChange"
              />
              <Select
                v-model="addressRegion.districtCode"
                :options="addressDistrictOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                placeholder="选择区 / 县"
                :disabled="!addressRegion.cityCode"
                @update:modelValue="syncAddressRegionText"
              />
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              详细地址
            </label>
            <Textarea
              v-model="addressForm.detail"
              rows="4"
              class="w-full"
              placeholder="请输入详细地址"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Checkbox v-model="addressForm.isDefault" binary inputId="defaultAddress" />
          <label for="defaultAddress" class="text-sm text-gray-700 dark:text-gray-200">
            设为默认地址
          </label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="addressDialogVisible = false" />
          <Button
            :label="isEditingAddress ? '保存修改' : '确认新增'"
            :loading="savingAddress"
            @click="submitAddress"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'

import { regionData, codeToText } from 'element-china-area-data'

import {
  apiGetUserProfile,
  apiUpdateUserProfile,
  apiAddAddress,
  apiUpdateAddress,
  apiDeleteAddress,
} from '@/api/userProfile.api.js'

import { avatarSrcByKey } from '@/utils/avatar.js'

const toast = useToast()

const loadingProfile = ref(false)
const savingProfile = ref(false)
const savingAddress = ref(false)
const deletingId = ref('')
const defaultingId = ref('')

const profile = ref(null)

const addressDialogVisible = ref(false)
const isEditingAddress = ref(false)
const editingAddressId = ref('')

const avatarOptions = [
  { label: 'a1', value: 'a1', img: avatarSrcByKey('a1') },
  { label: 'a2', value: 'a2', img: avatarSrcByKey('a2') },
  { label: 'a3', value: 'a3', img: avatarSrcByKey('a3') },
  { label: 'a4', value: 'a4', img: avatarSrcByKey('a4') },
  { label: 'a5', value: 'a5', img: avatarSrcByKey('a5') },
  { label: 'a6', value: 'a6', img: avatarSrcByKey('a6') },
]
const profileForm = ref({
  name: '',
  avatarKey: 'a1',
  defaultLocation: '',
})

const defaultRegion = ref({
  provinceCode: '',
  cityCode: '',
  districtCode: '',
})

const addressForm = ref({
  receiver: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
})

const addressRegion = ref({
  provinceCode: '',
  cityCode: '',
  districtCode: '',
})

const addresses = computed(() => {
  return Array.isArray(profile.value?.addresses) ? profile.value.addresses : []
})

const currentAvatarSrc = computed(() => {
  return avatarSrcByKey(profileForm.value.avatarKey || profile.value?.avatarKey || 'a1')
})

function mapRegionOptions(nodes = []) {
  return nodes.map((item) => ({
    label: item.label,
    value: item.value,
    children: item.children || [],
  }))
}

const defaultProvinceOptions = computed(() => mapRegionOptions(regionData))

const defaultCityOptions = computed(() => {
  const province = regionData.find((x) => x.value === defaultRegion.value.provinceCode)
  return mapRegionOptions(province?.children || [])
})

const defaultDistrictOptions = computed(() => {
  const province = regionData.find((x) => x.value === defaultRegion.value.provinceCode)
  const city = province?.children?.find((x) => x.value === defaultRegion.value.cityCode)
  return mapRegionOptions(city?.children || [])
})

const addressProvinceOptions = computed(() => mapRegionOptions(regionData))

const addressCityOptions = computed(() => {
  const province = regionData.find((x) => x.value === addressRegion.value.provinceCode)
  return mapRegionOptions(province?.children || [])
})

const addressDistrictOptions = computed(() => {
  const province = regionData.find((x) => x.value === addressRegion.value.provinceCode)
  const city = province?.children?.find((x) => x.value === addressRegion.value.cityCode)
  return mapRegionOptions(city?.children || [])
})

function getRegionPathByCode(code) {
  if (!code) {
    return { provinceCode: '', cityCode: '', districtCode: '' }
  }

  for (const province of regionData) {
    if (province.value === code) {
      return {
        provinceCode: province.value,
        cityCode: '',
        districtCode: '',
      }
    }

    for (const city of province.children || []) {
      if (city.value === code) {
        return {
          provinceCode: province.value,
          cityCode: city.value,
          districtCode: '',
        }
      }

      for (const district of city.children || []) {
        if (district.value === code) {
          return {
            provinceCode: province.value,
            cityCode: city.value,
            districtCode: district.value,
          }
        }
      }
    }
  }

  return { provinceCode: '', cityCode: '', districtCode: '' }
}

function getCodeByText(provinceName, cityName, districtName) {
  const province = regionData.find((x) => x.label === provinceName)
  if (!province) return { provinceCode: '', cityCode: '', districtCode: '' }

  const city = (province.children || []).find((x) => x.label === cityName)
  if (!city) {
    return { provinceCode: province.value, cityCode: '', districtCode: '' }
  }

  const district = (city.children || []).find((x) => x.label === districtName)
  if (!district) {
    return { provinceCode: province.value, cityCode: city.value, districtCode: '' }
  }

  return {
    provinceCode: province.value,
    cityCode: city.value,
    districtCode: district.value,
  }
}

function getTextByCode(code) {
  return code ? codeToText[code] || '' : ''
}

function fillProfile(data) {
  const p = data?.data || {}
  profile.value = p

  profileForm.value = {
    name: p?.name || '',
    avatarKey: p?.avatarKey || 'a1',
    defaultLocation: p?.defaultLocation || '',
  }

  defaultRegion.value = getRegionPathByCode(p?.defaultLocation || '')
}

function resetAddressForm() {
  addressForm.value = {
    receiver: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false,
  }
  addressRegion.value = {
    provinceCode: '',
    cityCode: '',
    districtCode: '',
  }
}

function formatAddress(addr) {
  return [addr?.province, addr?.city, addr?.district, addr?.detail].filter(Boolean).join(' ')
}

function onDefaultProvinceChange() {
  defaultRegion.value.cityCode = ''
  defaultRegion.value.districtCode = ''
}

function onDefaultCityChange() {
  defaultRegion.value.districtCode = ''
}

function onAddressProvinceChange() {
  addressRegion.value.cityCode = ''
  addressRegion.value.districtCode = ''
  syncAddressRegionText()
}

function onAddressCityChange() {
  addressRegion.value.districtCode = ''
  syncAddressRegionText()
}

function syncAddressRegionText() {
  addressForm.value.province = getTextByCode(addressRegion.value.provinceCode)
  addressForm.value.city = getTextByCode(addressRegion.value.cityCode)
  addressForm.value.district = getTextByCode(addressRegion.value.districtCode)
}

watch(
  () => defaultRegion.value.districtCode,
  (val) => {
    if (val) {
      profileForm.value.defaultLocation = val
      return
    }
    if (defaultRegion.value.cityCode) {
      profileForm.value.defaultLocation = defaultRegion.value.cityCode
      return
    }
    if (defaultRegion.value.provinceCode) {
      profileForm.value.defaultLocation = defaultRegion.value.provinceCode
      return
    }
    profileForm.value.defaultLocation = ''
  },
)

watch(
  () => defaultRegion.value.cityCode,
  () => {
    if (!defaultRegion.value.districtCode) {
      if (defaultRegion.value.cityCode) {
        profileForm.value.defaultLocation = defaultRegion.value.cityCode
      } else if (defaultRegion.value.provinceCode) {
        profileForm.value.defaultLocation = defaultRegion.value.provinceCode
      } else {
        profileForm.value.defaultLocation = ''
      }
    }
  },
)

watch(
  () => defaultRegion.value.provinceCode,
  () => {
    if (!defaultRegion.value.cityCode && !defaultRegion.value.districtCode) {
      profileForm.value.defaultLocation = defaultRegion.value.provinceCode || ''
    }
  },
)

function openCreateDialog() {
  isEditingAddress.value = false
  editingAddressId.value = ''
  resetAddressForm()
  addressDialogVisible.value = true
}

function openEditDialog(addr) {
  isEditingAddress.value = true
  editingAddressId.value = addr._id || ''

  addressForm.value = {
    receiver: addr?.receiver || '',
    phone: addr?.phone || '',
    province: addr?.province || '',
    city: addr?.city || '',
    district: addr?.district || '',
    detail: addr?.detail || '',
    isDefault: !!addr?.isDefault,
  }

  addressRegion.value = getCodeByText(addr?.province || '', addr?.city || '', addr?.district || '')

  addressDialogVisible.value = true
}

async function loadProfile() {
  loadingProfile.value = true
  try {
    const res = await apiGetUserProfile()
    fillProfile(res)
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '获取失败',
      life: 2000,
    })
  } finally {
    loadingProfile.value = false
  }
}

async function updateProfile() {
  savingProfile.value = true
  try {
    const payload = {
      name: profileForm.value.name,
      avatarKey: profileForm.value.avatarKey,
      defaultLocation: profileForm.value.defaultLocation,
    }

    const res = await apiUpdateUserProfile(payload)
    fillProfile(res)

    toast.add({
      severity: 'success',
      summary: '资料已保存',
      life: 1500,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '更新失败',
      life: 2000,
    })
  } finally {
    savingProfile.value = false
  }
}

async function submitAddress() {
  if (
    !addressForm.value.receiver.trim() ||
    !addressForm.value.phone.trim() ||
    !addressForm.value.detail.trim() ||
    !addressForm.value.province ||
    !addressForm.value.city ||
    !addressForm.value.district
  ) {
    toast.add({
      severity: 'warn',
      summary: '请填写完整地址信息',
      life: 1800,
    })
    return
  }

  savingAddress.value = true
  try {
    const payload = {
      receiver: addressForm.value.receiver,
      phone: addressForm.value.phone,
      province: addressForm.value.province,
      city: addressForm.value.city,
      district: addressForm.value.district,
      detail: addressForm.value.detail,
      isDefault: addressForm.value.isDefault,
    }

    const res = isEditingAddress.value
      ? await apiUpdateAddress(editingAddressId.value, payload)
      : await apiAddAddress(payload)

    if (Array.isArray(res?.data)) {
      profile.value = {
        ...(profile.value || {}),
        addresses: res.data,
      }
    }

    addressDialogVisible.value = false
    resetAddressForm()

    toast.add({
      severity: 'success',
      summary: isEditingAddress.value ? '地址已更新' : '地址已新增',
      life: 1500,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '操作失败',
      life: 2000,
    })
  } finally {
    savingAddress.value = false
  }
}

async function removeAddress(addr) {
  deletingId.value = addr._id
  try {
    const res = await apiDeleteAddress(addr._id)

    if (Array.isArray(res?.data)) {
      profile.value = {
        ...(profile.value || {}),
        addresses: res.data,
      }
    }

    toast.add({
      severity: 'success',
      summary: '地址已删除',
      life: 1500,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '删除失败',
      life: 2000,
    })
  } finally {
    deletingId.value = ''
  }
}

async function setAsDefault(addr) {
  defaultingId.value = addr._id
  try {
    const res = await apiUpdateAddress(addr._id, {
      receiver: addr.receiver,
      phone: addr.phone,
      province: addr.province,
      city: addr.city,
      district: addr.district,
      detail: addr.detail,
      isDefault: true,
    })

    if (Array.isArray(res?.data)) {
      profile.value = {
        ...(profile.value || {}),
        addresses: res.data,
      }
    }

    toast.add({
      severity: 'success',
      summary: '已设为默认地址',
      life: 1500,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '设置失败',
      life: 2000,
    })
  } finally {
    defaultingId.value = ''
  }
}

onMounted(() => {
  loadProfile()
})
</script>
