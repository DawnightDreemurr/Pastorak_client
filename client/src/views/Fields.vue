<template>
  <div class="min-h-[calc(100vh-64px)] p-4 md:p-6 space-y-6">
    <section class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">地块管理</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          管理你的农田地块，并记录玉米种植计划。
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button label="新增地块" icon="pi pi-plus" @click="openCreateDialog" />
      </div>
    </section>

    <!-- 筛选 -->
    <Card class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              种植状态
            </label>
            <Select
              v-model="filters.planted"
              :options="plantedOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              placeholder="全部"
              @update:modelValue="loadFields"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              土壤类型
            </label>
            <Select
              v-model="filters.soilType"
              :options="soilTypeFilterOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              placeholder="全部"
              @update:modelValue="loadFields"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              搜索地块
            </label>
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model.trim="keyword" class="w-full" placeholder="输入地块名称搜索" />
            </IconField>
          </div>
        </div>
      </template>
    </Card>

    <!-- 列表 -->
    <div v-if="loading" class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Skeleton v-for="n in 4" :key="n" height="220px" class="rounded-3xl" />
    </div>

    <div
      v-else-if="!displayFields.length"
      class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/50 p-10 text-center shadow-sm"
    >
      <div class="text-lg font-black text-gray-900 dark:text-gray-100">暂无地块</div>
      <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        创建你的第一个地块，开始记录种植信息。
      </div>
      <Button class="mt-5" label="立即新增" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card
        v-for="field in displayFields"
        :key="field._id"
        class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm overflow-hidden"
      >
        <template #content>
          <div class="space-y-5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-lg font-black text-gray-900 dark:text-gray-100 truncate">
                    {{ field.name }}
                  </h2>
                  <Tag
                    :severity="field?.cornPlan?.isPlanted ? 'success' : 'warn'"
                    :value="field?.cornPlan?.isPlanted ? '已种植' : '未种植'"
                  />
                  <Tag severity="secondary" :value="field.soilType" />
                </div>
                <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  创建于：{{ formatDateTime(field.createdAt) }}
                </div>
              </div>

              <div
                class="rounded-2xl bg-green-50 dark:bg-green-500/10 px-4 py-3 text-right shrink-0"
              >
                <div class="text-xs font-bold text-green-700 dark:text-green-300">面积</div>
                <div class="text-xl font-black text-green-800 dark:text-green-200">
                  {{ formatArea(field.areaMu) }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4">
                <div class="text-xs text-gray-400">土壤类型</div>
                <div class="mt-1 text-base font-bold text-gray-900 dark:text-gray-100">
                  {{ field.soilType }}
                </div>
              </div>

              <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4">
                <div class="text-xs text-gray-400">播种日期</div>
                <div class="mt-1 text-base font-bold text-gray-900 dark:text-gray-100">
                  {{ formatDate(field?.cornPlan?.sowingDate) || '未设置' }}
                </div>
              </div>
            </div>

            <div v-if="field?.cornPlan?.note || field?.remark" class="grid grid-cols-1 gap-3">
              <div
                v-if="field?.cornPlan?.note"
                class="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 p-4"
              >
                <div class="text-xs text-gray-400">种植备注</div>
                <div class="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 break-words">
                  {{ field.cornPlan.note }}
                </div>
              </div>

              <div
                v-if="field?.remark"
                class="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 p-4"
              >
                <div class="text-xs text-gray-400">地块备注</div>
                <div class="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 break-words">
                  {{ field.remark }}
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <Button
                label="编辑地块"
                icon="pi pi-pencil"
                severity="secondary"
                @click="openEditDialog(field)"
              />
              <Button
                :label="field?.cornPlan?.isPlanted ? '修改种植信息' : '开始种植'"
                icon="pi pi-calendar"
                severity="success"
                outlined
                @click="openCornPlanDialog(field)"
              />
              <Button
                label="删除"
                icon="pi pi-trash"
                severity="danger"
                text
                :loading="deletingId === field._id"
                @click="confirmDeleteField(field)"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 地块新增/编辑 -->
    <Dialog
      v-model:visible="fieldDialogVisible"
      :header="isEditingField ? '编辑地块' : '新增地块'"
      modal
      class="w-[94vw] sm:w-[40rem]"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              地块名称
            </label>
            <InputText
              v-model.trim="fieldForm.name"
              class="w-full"
              placeholder="例如：东侧 1 号地"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              面积（亩）
            </label>
            <InputNumber
              v-model="fieldForm.areaMu"
              class="w-full"
              inputClass="w-full"
              :min="0"
              :minFractionDigits="0"
              :maxFractionDigits="2"
              placeholder="请输入面积"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              土壤类型
            </label>
            <Select
              v-model="fieldForm.soilType"
              :options="soilTypeOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              placeholder="请选择土壤类型"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              备注
            </label>
            <Textarea
              v-model="fieldForm.remark"
              rows="4"
              class="w-full"
              placeholder="可填写灌溉条件、交通情况等"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="fieldDialogVisible = false" />
          <Button
            :label="isEditingField ? '保存修改' : '确认新增'"
            :loading="savingField"
            @click="submitField"
          />
        </div>
      </template>
    </Dialog>

    <!-- 玉米种植计划 -->
    <Dialog
      v-model:visible="cornPlanDialogVisible"
      header="玉米种植计划"
      modal
      class="w-[94vw] sm:w-[34rem]"
    >
      <div class="space-y-4">
        <div class="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4">
          <div class="text-xs text-gray-400">当前地块</div>
          <div class="mt-1 text-base font-black text-gray-900 dark:text-gray-100">
            {{ currentCornPlanField?.name || '-' }}
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Checkbox v-model="cornPlanForm.isPlanted" binary inputId="isPlanted" />
          <label for="isPlanted" class="text-sm text-gray-700 dark:text-gray-200">
            已开始种植玉米
          </label>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            播种日期
          </label>
          <DatePicker
            v-model="cornPlanForm.sowingDate"
            class="w-full"
            inputClass="w-full"
            dateFormat="yy-mm-dd"
            showIcon
            :manualInput="false"
            placeholder="请选择播种日期"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            种植备注
          </label>
          <Textarea
            v-model="cornPlanForm.note"
            rows="4"
            class="w-full"
            placeholder="例如：膜下滴灌、密植、预计追肥时间等"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="cornPlanDialogVisible = false" />
          <Button
            label="保存"
            severity="success"
            :loading="savingCornPlan"
            @click="submitCornPlan"
          />
        </div>
      </template>
    </Dialog>

    <!-- 删除确认 -->
    <Dialog
      v-model:visible="deleteDialogVisible"
      header="确认删除地块"
      modal
      class="w-[92vw] max-w-sm"
    >
      <div class="text-sm text-gray-600 dark:text-gray-300 leading-6">
        将删除地块
        <span class="font-bold text-gray-900 dark:text-gray-100">
          {{ deletingField?.name || '' }}
        </span>
        ，此操作不可撤销，是否继续？
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="deleteDialogVisible = false" />
          <Button
            label="确认删除"
            severity="danger"
            icon="pi pi-trash"
            :loading="!!deletingId"
            @click="removeField"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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
import DatePicker from 'primevue/datepicker'
import Skeleton from 'primevue/skeleton'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

import {
  apiGetFields,
  apiCreateField,
  apiUpdateField,
  apiDeleteField,
  apiUpdateCornPlan,
} from '@/api/fields.api.js'

const toast = useToast()

const loading = ref(false)
const savingField = ref(false)
const savingCornPlan = ref(false)
const deletingId = ref('')

const fields = ref([])

const keyword = ref('')
const filters = ref({
  planted: '',
  soilType: '',
})

const fieldDialogVisible = ref(false)
const isEditingField = ref(false)
const editingFieldId = ref('')

const cornPlanDialogVisible = ref(false)
const currentCornPlanField = ref(null)

const deleteDialogVisible = ref(false)
const deletingField = ref(null)

const soilTypeOptions = [
  { label: '沙土', value: '沙土' },
  { label: '壤土', value: '壤土' },
  { label: '黏土', value: '黏土' },
  { label: '盐碱', value: '盐碱' },
  { label: '其他', value: '其他' },
]

const soilTypeFilterOptions = [{ label: '全部', value: '' }, ...soilTypeOptions]

const plantedOptions = [
  { label: '全部', value: '' },
  { label: '已种植', value: '1' },
  { label: '未种植', value: '0' },
]

const fieldForm = ref({
  name: '',
  areaMu: null,
  soilType: '壤土',
  remark: '',
})

const cornPlanForm = ref({
  isPlanted: false,
  sowingDate: null,
  note: '',
})

const displayFields = computed(() => {
  let list = Array.isArray(fields.value) ? [...fields.value] : []

  if (filters.value.soilType) {
    list = list.filter((x) => x.soilType === filters.value.soilType)
  }

  if (keyword.value) {
    const k = keyword.value.toLowerCase()
    list = list.filter((x) =>
      String(x.name || '')
        .toLowerCase()
        .includes(k),
    )
  }

  return list
})

function resetFieldForm() {
  fieldForm.value = {
    name: '',
    areaMu: null,
    soilType: '壤土',
    remark: '',
  }
}

function resetCornPlanForm() {
  cornPlanForm.value = {
    isPlanted: false,
    sowingDate: null,
    note: '',
  }
}

function formatArea(val) {
  const num = Number(val || 0)
  if (!Number.isFinite(num)) return '0 亩'
  return `${num} 亩`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
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

async function loadFields() {
  loading.value = true
  try {
    const params = {}
    if (filters.value.planted !== '') {
      params.planted = filters.value.planted
    }

    const res = await apiGetFields(params)
    fields.value = Array.isArray(res?.data) ? res.data : []

    if (filters.value.soilType) {
      fields.value = fields.value.filter((x) => x.soilType === filters.value.soilType)
    }
  } catch (e) {
    fields.value = []
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '获取地块失败',
      life: 2200,
    })
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  isEditingField.value = false
  editingFieldId.value = ''
  resetFieldForm()
  fieldDialogVisible.value = true
}

function openEditDialog(field) {
  isEditingField.value = true
  editingFieldId.value = field?._id || ''
  fieldForm.value = {
    name: field?.name || '',
    areaMu: Number(field?.areaMu ?? 0),
    soilType: field?.soilType || '壤土',
    remark: field?.remark || '',
  }
  fieldDialogVisible.value = true
}

async function submitField() {
  if (
    !fieldForm.value.name.trim() ||
    fieldForm.value.areaMu === null ||
    !fieldForm.value.soilType
  ) {
    toast.add({
      severity: 'warn',
      summary: '请填写完整地块信息',
      life: 1800,
    })
    return
  }

  savingField.value = true
  try {
    const payload = {
      name: fieldForm.value.name.trim(),
      areaMu: Number(fieldForm.value.areaMu),
      soilType: fieldForm.value.soilType,
      remark: fieldForm.value.remark?.trim() || '',
    }

    let res
    if (isEditingField.value) {
      res = await apiUpdateField(editingFieldId.value, payload)
      const updated = res?.data
      fields.value = fields.value.map((x) => (x._id === updated?._id ? updated : x))
    } else {
      res = await apiCreateField(payload)
      const created = res?.data
      if (created) fields.value.unshift(created)
    }

    fieldDialogVisible.value = false
    resetFieldForm()

    toast.add({
      severity: 'success',
      summary: isEditingField.value ? '地块已更新' : '地块已创建',
      life: 1600,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '保存地块失败',
      life: 2200,
    })
  } finally {
    savingField.value = false
  }
}

function openCornPlanDialog(field) {
  currentCornPlanField.value = field
  cornPlanForm.value = {
    isPlanted: Boolean(field?.cornPlan?.isPlanted),
    sowingDate: field?.cornPlan?.sowingDate ? new Date(field.cornPlan.sowingDate) : null,
    note: field?.cornPlan?.note || '',
  }
  cornPlanDialogVisible.value = true
}

async function submitCornPlan() {
  if (!currentCornPlanField.value?._id) return

  savingCornPlan.value = true
  try {
    const payload = {
      isPlanted: Boolean(cornPlanForm.value.isPlanted),
      note: cornPlanForm.value.note?.trim() || '',
      sowingDate: cornPlanForm.value.sowingDate ? formatDate(cornPlanForm.value.sowingDate) : '',
    }

    const res = await apiUpdateCornPlan(currentCornPlanField.value._id, payload)
    const updated = res?.data
    fields.value = fields.value.map((x) => (x._id === updated?._id ? updated : x))

    cornPlanDialogVisible.value = false
    currentCornPlanField.value = null
    resetCornPlanForm()

    toast.add({
      severity: 'success',
      summary: '种植信息已更新',
      life: 1600,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '更新种植信息失败',
      life: 2200,
    })
  } finally {
    savingCornPlan.value = false
  }
}

function confirmDeleteField(field) {
  deletingField.value = field
  deleteDialogVisible.value = true
}

async function removeField() {
  if (!deletingField.value?._id) return

  deletingId.value = deletingField.value._id
  try {
    await apiDeleteField(deletingField.value._id)
    fields.value = fields.value.filter((x) => x._id !== deletingField.value._id)
    deleteDialogVisible.value = false
    deletingField.value = null

    toast.add({
      severity: 'success',
      summary: '地块已删除',
      life: 1600,
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: e?.response?.data?.message || e?.message || '删除地块失败',
      life: 2200,
    })
  } finally {
    deletingId.value = ''
  }
}

// async function setAsDefault(field) {
//   // 占位，Fields 无默认概念；保留无用函数避免误调用 —— 不使用
//   void field
// }

onMounted(() => {
  loadFields()
})
</script>
