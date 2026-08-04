import request from '@/utils/request'

/**
 * 从购物车提交订单
 * POST /api/orders
 * body: { addressId? }
 */
export function apiCreateOrderFromCart(payload = {}) {
  return request.post('/orders', payload)
}

/**
 * 我的订单列表（分页/按状态）
 * GET /api/orders
 * params: { status?, page?, limit? }
 */
export function apiGetMyOrders(params = {}) {
  return request.get('/orders', { params })
}

/**
 * 订单详情
 * GET /api/orders/:id
 */
export function apiGetMyOrderById(id) {
  return request.get(`/orders/${id}`)
}

/**
 * 购买记录（shipped/completed）
 * GET /api/purchases
 * params: { page?, limit? }
 */
export function apiGetMyPurchases(params = {}) {
  return request.get('/purchases', { params })
}
