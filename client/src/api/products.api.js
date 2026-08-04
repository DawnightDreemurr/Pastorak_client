import request from '@/utils/request'

/**
 * 商品列表（分页/搜索/筛选）
 * GET /api/products
 * params: { page, limit, category, q, onSale, tag, sort }
 */
export function apiGetProducts(params = {}) {
  return request.get('/products', { params })
}

/**
 * 商品详情
 * GET /api/products/:id
 */
export function apiGetProductById(id) {
  return request.get(`/products/${id}`)
}

/**
 * 管理员：创建商品
 * POST /api/admin/products
 */
export function apiAdminCreateProduct(payload) {
  return request.post('/admin/products', payload)
}

/**
 * 管理员：更新商品
 * PUT /api/admin/products/:id
 */
export function apiAdminUpdateProduct(id, payload) {
  return request.put(`/admin/products/${id}`, payload)
}

/**
 * 管理员：删除商品
 * DELETE /api/admin/products/:id
 */
export function apiAdminDeleteProduct(id) {
  return request.delete(`/admin/products/${id}`)
}
