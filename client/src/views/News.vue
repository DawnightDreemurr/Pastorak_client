<template>
  <div class="p-4 md:p-6 space-y-4 md:space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <div class="text-2xl font-black text-zinc-900 dark:text-zinc-100">农业资讯</div>
        <div class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">

        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
        <select
          v-model="type"
          class="h-10 w-full sm:w-[220px] rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-100"
        >
          <option value="">全部</option>
          <option value="NEWS">资讯（NEWS）</option>
          <option value="POLICY">政策（POLICY）</option>
        </select>
      </div>
    </div>

    <!-- List Panel -->
    <section
      class="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 md:p-5 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/30"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="font-extrabold text-zinc-900 dark:text-zinc-100">列表</div>
        <div class="text-xs text-zinc-500 dark:text-zinc-400">共 {{ total }} 条</div>
      </div>

      <div class="mt-3 h-px bg-zinc-200/70 dark:bg-zinc-800/70" />

      <div v-if="loading" class="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
        加载中…
      </div>

      <div
        v-else-if="items.length === 0"
        class="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400"
      >
        暂无数据
      </div>

      <ul v-else class="mt-3 space-y-2">
        <li v-for="it in items" :key="it._id">
          <RouterLink
            :to="{ name: 'news-detail', params: { id: it._id } }"
            class="block rounded-xl border border-zinc-200/70 bg-white/60 p-3 text-left transition hover:bg-zinc-50 active:scale-[0.995] dark:border-zinc-800/70 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/50"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                {{ it.title }}
              </div>

              <span
                class="shrink-0 rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300"
              >
                {{ it.type }}
              </span>
            </div>

            <div
              class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400"
            >
              <span>{{ it.sourceName || '—' }}</span>
              <span>·</span>
              <span>{{ formatDate(it.publishDate) }}</span>
            </div>
          </RouterLink>
        </li>
      </ul>

      <!-- Pagination -->
      <div
        class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        v-if="total > 0"
      >
        <div class="text-xs text-zinc-500 dark:text-zinc-400">
          第 {{ page }} / {{ totalPages }} 页
        </div>

        <div class="flex items-center gap-2">
          <button
            class="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-100 dark:hover:bg-zinc-900"
            :disabled="page <= 1 || loading"
            @click="goPage(page - 1)"
          >
            上一页
          </button>

          <button
            class="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-100 dark:hover:bg-zinc-900"
            :disabled="page >= totalPages || loading"
            @click="goPage(page + 1)"
          >
            下一页
          </button>

          <select
            v-model.number="limit"
            class="h-9 rounded-lg border border-zinc-200 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-100"
            :disabled="loading"
          >
            <option :value="10">10/页</option>
            <option :value="20">20/页</option>
            <option :value="30">30/页</option>
          </select>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { apiGetArticles } from '@/api/articles.api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const items = ref([])
const total = ref(0)
const totalPages = ref(1)

const type = ref(route.query.type ? String(route.query.type) : '')
const page = ref(route.query.page ? Number(route.query.page) : 1)
const limit = ref(route.query.limit ? Number(route.query.limit) : 10)

function formatDate(iso) {
  if (!iso) return '—'
  return String(iso).slice(0, 10)
}

async function loadList() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: limit.value,
    }
    if (type.value) params.type = type.value

    const res = await apiGetArticles(params)
    const nextItems = res?.data?.items

    if (Array.isArray(nextItems)) {
      items.value = nextItems
      total.value = Number(res.data.total || 0)
      totalPages.value = Number(res.data.totalPages || 1)
    } else {
      items.value = []
      total.value = 0
      totalPages.value = 1
    }
  } catch {
    items.value = []
    total.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

function syncQuery() {
  const q = { ...route.query }

  if (type.value) q.type = type.value
  else delete q.type

  q.page = String(page.value)
  q.limit = String(limit.value)

  router.replace({ query: q })
}

function goPage(p) {
  page.value = Math.max(1, p)
}

watch(type, () => {
  page.value = 1
  syncQuery()
  loadList()
})

watch([page, limit], () => {
  syncQuery()
  loadList()
})

onMounted(() => {
  loadList()
})
</script>
