<template>
  <div class="p-4 md:p-6 space-y-6">
    <Toast position="top-center" />

    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">个人信息测试页</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        用于联调用户资料与地址相关接口，当前直接展示 raw json。
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 用户资料 -->
      <Card>
        <template #title>用户资料</template>
        <template #content>
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row gap-2">
              <Button
                label="获取资料"
                icon="pi pi-refresh"
                :loading="loadingProfile"
                @click="loadProfile"
              />
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">姓名</label>
                <InputText v-model="profileForm.name" class="w-full" placeholder="请输入姓名" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">头像</label>
                <Dropdown
                  v-model="profileForm.avatarKey"
                  :options="avatarOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                  placeholder="请选择头像"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">默认地区</label>
                <Dropdown
                  v-model="profileForm.defaultLocation"
                  :options="locationOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                  placeholder="请选择默认地区"
                />
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-2">
              <Button
                label="更新资料"
                icon="pi pi-save"
                :loading="savingProfile"
                @click="updateProfile"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- 地址 -->
      <Card>
        <template #title>地址操作</template>
        <template #content>
          <div class="space-y-4">
            <div class="grid grid-cols-1 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">地址 ID（更新/删除时需要）</label>
                <InputText v-model="addressId" class="w-full" placeholder="请输入地址 id" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">收件人</label>
                <InputText
                  v-model="addressForm.receiver"
                  class="w-full"
                  placeholder="请输入收件人"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">联系电话</label>
                <InputText
                  v-model="addressForm.phone"
                  class="w-full"
                  placeholder="请输入联系电话"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">省</label>
                <InputText
                  v-model="addressForm.province"
                  class="w-full"
                  placeholder="例如：吉林省"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">市</label>
                <InputText v-model="addressForm.city" class="w-full" placeholder="例如：长春市" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">区 / 县</label>
                <InputText
                  v-model="addressForm.district"
                  class="w-full"
                  placeholder="例如：朝阳区"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">详细地址</label>
                <Textarea
                  v-model="addressForm.detail"
                  rows="3"
                  class="w-full"
                  placeholder="请输入详细地址"
                />
              </div>

              <div class="flex items-center gap-2">
                <Checkbox v-model="addressForm.isDefault" binary inputId="isDefault" />
                <label for="isDefault" class="text-sm">设为默认地址</label>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row flex-wrap gap-2">
              <Button
                label="添加地址"
                icon="pi pi-plus"
                :loading="savingAddress"
                @click="addAddress"
              />
              <Button
                label="更新地址"
                icon="pi pi-pencil"
                severity="secondary"
                :loading="savingAddress"
                @click="updateAddress"
              />
              <Button
                label="删除地址"
                icon="pi pi-trash"
                severity="danger"
                :loading="deletingAddress"
                @click="deleteAddress"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Card>
      <template #title>
        <div class="flex items-center justify-between gap-2">
          <span>Raw JSON</span>
          <Button
            label="复制"
            icon="pi pi-copy"
            size="small"
            severity="secondary"
            @click="copyRawJson"
          />
        </div>
      </template>
      <template #content>
        <pre
          class="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap break-all min-h-[240px]"
          >{{ rawJson }}</pre
        >
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import Dropdown from 'primevue/dropdown'

import {
  apiGetUserProfile,
  apiUpdateUserProfile,
  apiAddAddress,
  apiUpdateAddress,
  apiDeleteAddress,
} from '@/api/userProfile.api.js'

const toast = useToast()

const loadingProfile = ref(false)
const savingProfile = ref(false)
const savingAddress = ref(false)
const deletingAddress = ref(false)

const rawData = ref(null)

const avatarOptions = [
  { label: '头像 a1', value: 'a1' },
  { label: '头像 a2', value: 'a2' },
  { label: '头像 a3', value: 'a3' },
  { label: '头像 a4', value: 'a4' },
  { label: '头像 a5', value: 'a5' },
  { label: '头像 a6', value: 'a6' },
]

const locationOptions = [
  { label: '长春（101060101）', value: '101060101' },
  { label: '吉林（101060201）', value: '101060201' },
  { label: '四平（101060401）', value: '101060401' },
  { label: '松原（101060801）', value: '101060801' },
  { label: '白城（101060601）', value: '101060601' },
  { label: '延吉（101060301）', value: '101060301' },
]

const profileForm = ref({
  name: '',
  avatarKey: 'a1',
  defaultLocation: '101060101',
})

const addressId = ref('')

const addressForm = ref({
  receiver: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
})

const rawJson = computed(() => {
  if (!rawData.value) return '{}'
  try {
    return JSON.stringify(rawData.value, null, 2)
  } catch {
    return String(rawData.value)
  }
})

function setRawData(data) {
  rawData.value = data
}

function fillProfileForm(data) {
  const profile = data?.data || {}
  profileForm.value = {
    name: profile?.name || '',
    avatarKey: profile?.avatarKey || 'a1',
    defaultLocation: profile?.defaultLocation || '101060101',
  }
}

async function loadProfile() {
  loadingProfile.value = true
  try {
    const res = await apiGetUserProfile()
    setRawData(res)
    fillProfileForm(res)
    toast.add({
      severity: 'success',
      summary: '获取成功',
      life: 1500,
    })
  } catch (e) {
    setRawData(e?.response?.data || { message: e?.message || '获取失败' })
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
    setRawData(res)
    fillProfileForm(res)

    toast.add({
      severity: 'success',
      summary: '更新成功',
      life: 1500,
    })
  } catch (e) {
    setRawData(e?.response?.data || { message: e?.message || '更新失败' })
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '更新失败',
      life: 2000,
    })
  } finally {
    savingProfile.value = false
  }
}

async function addAddress() {
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

    const res = await apiAddAddress(payload)
    setRawData(res)

    toast.add({
      severity: 'success',
      summary: '添加成功',
      life: 1500,
    })
  } catch (e) {
    setRawData(e?.response?.data || { message: e?.message || '添加失败' })
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '添加失败',
      life: 2000,
    })
  } finally {
    savingAddress.value = false
  }
}

async function updateAddress() {
  if (!addressId.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: '请先输入地址 ID',
      life: 1500,
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

    const res = await apiUpdateAddress(addressId.value.trim(), payload)
    setRawData(res)

    toast.add({
      severity: 'success',
      summary: '更新成功',
      life: 1500,
    })
  } catch (e) {
    setRawData(e?.response?.data || { message: e?.message || '更新失败' })
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '更新失败',
      life: 2000,
    })
  } finally {
    savingAddress.value = false
  }
}

async function deleteAddress() {
  if (!addressId.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: '请先输入地址 ID',
      life: 1500,
    })
    return
  }

  deletingAddress.value = true
  try {
    const res = await apiDeleteAddress(addressId.value.trim())
    setRawData(res)

    toast.add({
      severity: 'success',
      summary: '删除成功',
      life: 1500,
    })
  } catch (e) {
    setRawData(e?.response?.data || { message: e?.message || '删除失败' })
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '删除失败',
      life: 2000,
    })
  } finally {
    deletingAddress.value = false
  }
}

async function copyRawJson() {
  try {
    await navigator.clipboard.writeText(rawJson.value)
    toast.add({
      severity: 'success',
      summary: '已复制',
      life: 1200,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: '复制失败',
      life: 1500,
    })
  }
}
</script>
