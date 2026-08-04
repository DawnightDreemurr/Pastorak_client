import request from '@/utils/request'

/**
 * 获取我的购物车
 * GET /api/cart
 */
export function apiGetMyCart() {
  return request.get('/cart')
}

/**
 * 加入购物车（或累加）
 * POST /api/cart/items
 * body: { productId, qty }
 */
export function apiAddCartItem(payload) {
  return request.post('/cart/items', payload)
}

/**
 * 更新购物车条目
 * PUT /api/cart/items/:itemId
 * body: { qty?, checked? }
 */
export function apiUpdateCartItem(itemId, payload) {
  return request.put(`/cart/items/${itemId}`, payload)
}

/**
 * 删除购物车条目
 * DELETE /api/cart/items/:itemId
 */
export function apiRemoveCartItem(itemId) {
  return request.delete(`/cart/items/${itemId}`)
}

/**
 * 清空购物车
 * DELETE /api/cart/clear
 */
export function apiClearCart() {
  return request.delete('/cart/clear')
}
