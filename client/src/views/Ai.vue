<template>
  <div class="min-h-[calc(100vh-64px)] p-4 md:p-6 space-y-4 md:space-y-6">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <div class="text-2xl font-black text-gray-900 dark:text-gray-100">AI 植物识别</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          上传图片或粘贴图片 URL，快速识别植物名称与基础信息。
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button severity="secondary" icon="pi pi-trash" label="清空" @click="resetAll" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <!-- 左侧输入 -->
      <Card
        class="lg:col-span-3 rounded-2xl overflow-hidden border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/60 backdrop-blur"
      >
        <template #content>
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <div class="font-extrabold text-gray-900 dark:text-gray-100">输入方式</div>
              <Tag value="Baidu AI" severity="success" />
            </div>

            <Tabs value="url">
              <TabList>
                <Tab value="url">图片 URL</Tab>
                <Tab value="file">本地上传</Tab>
              </TabList>

              <TabPanels>
                <TabPanel value="url">
                  <div class="space-y-4">
                    <div class="text-sm text-gray-600 dark:text-gray-300">
                      粘贴一张可访问的图片链接，点击识别即可。
                    </div>

                    <div class="flex flex-col sm:flex-row gap-2">
                      <InputText
                        v-model="imgUrl"
                        class="flex-1"
                        placeholder="https://.../plant.jpg"
                        @keyup.enter="doIdentifyUrl"
                      />
                      <Button
                        icon="pi pi-search"
                        label="识别"
                        :loading="loading"
                        :disabled="!imgUrl.trim()"
                        @click="doIdentifyUrl"
                      />
                    </div>

                    <div
                      v-if="previewUrl"
                      class="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 overflow-hidden bg-white dark:bg-gray-900/40"
                    >
                      <div class="px-4 py-3 flex items-center justify-between">
                        <div class="font-bold text-gray-900 dark:text-gray-100">图片预览</div>
                        <Button
                          size="small"
                          severity="secondary"
                          icon="pi pi-external-link"
                          label="打开"
                          @click="openPreview"
                        />
                      </div>
                      <div class="p-3">
                        <img
                          :src="previewUrl"
                          alt="预览图"
                          class="w-full max-h-[420px] object-contain rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value="file">
                  <div class="space-y-4">
                    <div class="text-sm text-gray-600 dark:text-gray-300">
                      选择本地图片后上传识别，移动端也可直接点击选择。
                    </div>

                    <div class="space-y-2">
                      <div class="relative w-full sm:w-auto">
                        <input
                          ref="fileInput"
                          type="file"
                          accept="image/*"
                          class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                          @change="onPickFile"
                        />
                        <Button
                          icon="pi pi-upload"
                          label="选择图片"
                          severity="secondary"
                          class="w-full sm:w-auto"
                        />
                      </div>

                      <div class="flex flex-col sm:flex-row gap-2">
                        <Button
                          icon="pi pi-search"
                          label="识别"
                          :loading="loading"
                          :disabled="!pickedFile"
                          class="w-full sm:w-auto"
                          @click="doIdentifyFile"
                        />
                        <Button
                          v-if="pickedFile"
                          icon="pi pi-times"
                          label="移除"
                          severity="secondary"
                          class="w-full sm:w-auto"
                          @click="clearPicked"
                        />
                      </div>

                      <div
                        v-if="pickedFile"
                        class="text-sm text-gray-500 dark:text-gray-400 break-all"
                      >
                        已选择：{{ pickedFile.name }}
                      </div>
                    </div>

                    <div
                      v-if="localPreview"
                      class="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 overflow-hidden bg-white dark:bg-gray-900/40"
                    >
                      <div class="px-4 py-3">
                        <div class="font-bold text-gray-900 dark:text-gray-100">图片预览</div>
                      </div>
                      <div class="p-3">
                        <img
                          :src="localPreview"
                          alt="本地预览图"
                          class="w-full max-h-[420px] object-contain rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </template>
      </Card>

      <!-- 右侧结果 -->
      <Card
        class="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/60 backdrop-blur"
      >
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="font-extrabold text-gray-900 dark:text-gray-100">识别结果</div>
              <Tag v-if="resultAt" :value="resultAt" severity="info" />
            </div>

            <div v-if="loading" class="py-12 flex flex-col items-center justify-center text-center">
              <ProgressSpinner style="width: 42px; height: 42px" />
              <div class="mt-3 text-sm text-gray-500 dark:text-gray-400">AI 正在识别中…</div>
            </div>

            <div v-else-if="errorMsg">
              <div
                class="rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-4"
              >
                <div class="text-sm font-bold text-red-700 dark:text-red-300">识别失败</div>
                <div class="mt-2 text-sm text-red-600 dark:text-red-200 break-words">
                  {{ errorMsg }}
                </div>
              </div>
            </div>

            <div
              v-else-if="!displayResult"
              class="py-12 text-center text-gray-500 dark:text-gray-400"
            >
              暂无结果。请先上传图片或输入图片 URL。
            </div>

            <div v-else class="space-y-4">
              <div
                class="relative overflow-hidden rounded-3xl border border-emerald-200/70 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50 via-white to-lime-50 dark:from-emerald-950/30 dark:via-gray-900 dark:to-lime-950/20 p-5 shadow-sm"
              >
                <div
                  class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl dark:bg-emerald-500/10"
                ></div>

                <div class="flex items-start gap-4">
                  <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white text-xl shadow"
                  >
                    🌿
                  </div>

                  <div class="min-w-0 flex-1">
                    <div
                      class="text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-300"
                    >
                      最可能结果
                    </div>
                    <div
                      class="mt-1 text-2xl font-black text-gray-900 dark:text-gray-100 break-words"
                    >
                      {{ displayResult.name }}
                    </div>
                    <div class="mt-3 flex flex-wrap items-center gap-2">
                      <Tag
                        severity="success"
                        :value="`置信度 ${formatScore(displayResult.score)}`"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="displayResult.imageUrl"
                class="overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-900/40"
              >
                <img
                  :src="displayResult.imageUrl"
                  alt="植物图片"
                  class="w-full h-56 sm:h-64 object-cover"
                />
              </div>

              <div
                class="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-900/40 p-5 space-y-4"
              >
                <div>
                  <div class="text-sm font-bold text-gray-900 dark:text-gray-100">植物名称</div>
                  <div class="mt-1 text-base text-gray-700 dark:text-gray-300 break-words">
                    {{ displayResult.name }}
                  </div>
                </div>

                <div>
                  <div class="text-sm font-bold text-gray-900 dark:text-gray-100">识别置信度</div>
                  <div class="mt-1 text-base text-gray-700 dark:text-gray-300">
                    {{ formatScore(displayResult.score) }}
                  </div>
                </div>

                <div v-if="displayResult.description">
                  <div class="text-sm font-bold text-gray-900 dark:text-gray-100">简介</div>
                  <div class="mt-1 text-sm leading-7 text-gray-600 dark:text-gray-300 break-words">
                    {{ displayResult.description }}
                  </div>
                </div>

                <div v-if="displayResult.baikeUrl">
                  <a
                    :href="displayResult.baikeUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    查看百科详情
                    <i class="pi pi-external-link text-xs"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import ProgressSpinner from 'primevue/progressspinner'

import { apiPlantIdentifyByUrl, apiPlantIdentifyByFile } from '@/api/ai.api.js'

const toast = useToast()

const loading = ref(false)
const errorMsg = ref('')
const resultAt = ref('')
const result = ref(null)

const imgUrl = ref('')
const previewUrl = ref('')

const fileInput = ref(null)
const pickedFile = ref(null)
const localPreview = ref('')

function normalizeResult(res) {
  if (!res?.success) return null

  const first = res?.data?.results?.[0]
  if (!first) return null

  return {
    name: first.name || '未知植物',
    score: Number(first.score ?? 0),
    description: first.baike?.description || '',
    imageUrl: first.baike?.imageUrl || '',
    baikeUrl: first.baike?.baikeUrl || '',
  }
}

const displayResult = computed(() => normalizeResult(result.value))

watch(imgUrl, (v) => {
  previewUrl.value = v?.trim() || ''
})

function formatScore(s) {
  const n = Number(s)
  if (!Number.isFinite(n)) return '0%'
  return `${Math.round(n * 100)}%`
}

function stampNow() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}

function resetAll() {
  imgUrl.value = ''
  previewUrl.value = ''
  clearPicked()
  result.value = null
  errorMsg.value = ''
  resultAt.value = ''
}

function clearPicked() {
  pickedFile.value = null
  if (localPreview.value) URL.revokeObjectURL(localPreview.value)
  localPreview.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function openPreview() {
  if (previewUrl.value) {
    window.open(previewUrl.value, '_blank', 'noopener,noreferrer')
  }
}

function onPickFile(e) {
  const f = e.target.files?.[0]
  if (!f) return
  pickedFile.value = f
  if (localPreview.value) URL.revokeObjectURL(localPreview.value)
  localPreview.value = URL.createObjectURL(f)
}

async function doIdentifyUrl() {
  const url = imgUrl.value.trim()
  if (!url) return

  loading.value = true
  errorMsg.value = ''
  result.value = null

  try {
    const res = await apiPlantIdentifyByUrl(url)
    result.value = res
    resultAt.value = stampNow()

    if (!normalizeResult(res)) {
      throw new Error(res?.message || '未获取到有效识别结果')
    }

    toast.add({
      severity: 'success',
      summary: '识别完成',
      life: 1500,
    })
  } catch (e) {
    errorMsg.value =
      e?.response?.data?.error || e?.response?.data?.message || e?.message || 'URL 识别失败'
  } finally {
    loading.value = false
  }
}

async function doIdentifyFile() {
  if (!pickedFile.value) return

  loading.value = true
  errorMsg.value = ''
  result.value = null

  try {
    const res = await apiPlantIdentifyByFile(pickedFile.value, 5, 5)
    result.value = res
    resultAt.value = stampNow()

    if (!normalizeResult(res)) {
      throw new Error(res?.message || '未获取到有效识别结果')
    }

    toast.add({
      severity: 'success',
      summary: '识别完成',
      life: 1500,
    })
  } catch (e) {
    console.error('upload identify error:', e)
    errorMsg.value =
      e?.response?.data?.error || e?.response?.data?.message || e?.message || '文件上传识别失败'
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  if (localPreview.value) URL.revokeObjectURL(localPreview.value)
})
</script>
