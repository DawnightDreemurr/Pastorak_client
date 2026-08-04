import request from '@/utils/request'

/**
 * 新闻/政策列表
 * GET /api/articles
 * params: { type?, page?, limit? }
 * type: "news" | "policy"（你后端怎么定义就怎么传）
 */
export function apiGetArticles(params = {}) {
  return request.get('/articles', { params })
}

/**
 * 文章详情
 * GET /api/articles/:id
 */
export function apiGetArticleById(id) {
  return request.get(`/articles/${id}`)
}
