<template>
  <div class="p-4 md:p-6">
    <div class="mx-auto max-w-5xl space-y-4 md:space-y-6">
      <!-- Top bar -->
      <div class="flex items-center justify-between gap-3">
        <div>
          <div class="text-2xl font-black text-zinc-900 dark:text-zinc-100">资讯详情</div>
          <div class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {{ metaLine }}
          </div>
        </div>

        <RouterLink
          to="/app/news"
          class="h-10 inline-flex items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          返回列表
        </RouterLink>
      </div>

      <section
        class="rounded-3xl border border-zinc-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/40 md:p-8"
      >
        <div v-if="loading" class="py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          加载中…
        </div>

        <div
          v-else-if="!article"
          class="py-16 text-center text-sm text-zinc-500 dark:text-zinc-400"
        >
          暂无数据
        </div>

        <article v-else class="mx-auto max-w-3xl">
          <!-- Header -->
          <header class="border-b border-zinc-200/70 pb-6 dark:border-zinc-800/70">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-full border border-emerald-200/70 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
              >
                {{ article.type || 'ARTICLE' }}
              </span>

              <span
                class="rounded-full border border-zinc-200/70 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:text-zinc-300"
              >
                {{ article.sourceName || '—' }}
              </span>
            </div>

            <h1
              class="mt-4 text-2xl font-black leading-tight text-zinc-900 dark:text-zinc-100 md:text-4xl"
            >
              {{ article.title }}
            </h1>

            <div
              class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400"
            >
              <span>发布时间：{{ formatDate(article.publishDate) }}</span>
              <span v-if="article.updatedAt">更新时间：{{ formatDate(article.updatedAt) }}</span>
              <span v-if="article.author">作者：{{ article.author }}</span>
            </div>

            <div v-if="article.sourceUrl" class="mt-4">
              <a
                :href="article.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
              >
                查看原文
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </header>

          <!-- Content -->
          <div class="pt-8">
            <div
              class="article-content prose prose-zinc max-w-none dark:prose-invert prose-p:my-5 prose-p:leading-8 prose-headings:font-black prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-a:text-emerald-700 dark:prose-a:text-emerald-300 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-li:my-1 prose-ul:my-5 prose-ol:my-5 prose-blockquote:border-emerald-500 prose-blockquote:text-zinc-600 dark:prose-blockquote:text-zinc-300"
              v-html="cleanContent"
            ></div>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { apiGetArticleById } from '@/api/articles.api'

const route = useRoute()
const loading = ref(false)
const article = ref(null)

const id = computed(() => String(route.params.id || ''))

function formatDate(iso) {
  if (!iso) return '—'
  return String(iso).slice(0, 10)
}

const metaLine = computed(() => (id.value ? `ID：${id.value}` : ''))

async function load() {
  if (!id.value) {
    article.value = null
    return
  }

  loading.value = true
  try {
    const res = await apiGetArticleById(id.value)
    article.value = res?.data ?? null
  } catch {
    article.value = null
  } finally {
    loading.value = false
  }
}

const cleanContent = computed(() => {
  const raw = article.value?.content || ''
  if (!raw) return ''

  let s = String(raw)

  // 去掉抓取时混进来的 .TRS_Editor 样式文本
  s = s.replace(/\.TRS_Editor[\s\S]*?\}\s*/g, '')

  // 去掉 script
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')

  // 如果内容里几乎没有 HTML 标签，就按纯文本分段包装成 <p>
  const hasHtmlTag = /<\/?[a-z][\s\S]*>/i.test(s)

  if (!hasHtmlTag) {
    s = s
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
      .join('')
  }

  return s
})

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

watch(id, load, { immediate: true })
</script>

<style scoped>
.article-content {
  font-size: 1.05rem;
  line-height: 2;
  word-break: break-word;
}

.article-content :deep(p) {
  margin: 1.1em 0;
  text-indent: 2em;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  margin-top: 1.6em;
  margin-bottom: 0.8em;
  text-indent: 0;
}

.article-content :deep(ul),
.article-content :deep(ol),
.article-content :deep(blockquote) {
  text-indent: 0;
}

.article-content :deep(img) {
  border-radius: 1rem;
  margin: 1.5rem auto;
}

.article-content :deep(table) {
  display: block;
  overflow-x: auto;
  border-collapse: collapse;
  width: 100%;
}

.article-content :deep(td),
.article-content :deep(th) {
  border: 1px solid rgba(113, 113, 122, 0.25);
  padding: 0.6rem 0.8rem;
}
</style>
