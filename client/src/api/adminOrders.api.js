import request from '@/utils/request'

/**
 * 管理员订单列表（可按状态筛选）
 * GET /api/admin/orders
 * params: { status?, page?, limit? }
 */
export function apiAdminGetOrders(params = {}) {
  return request.get('/admin/orders', { params })
}

/**
 * 管理员一键发货（同意=直接发货）
 * PUT /api/admin/orders/:id/ship
 * body: { carrier?, trackingNo? }
 */
export function apiAdminShipOrder(id, payload = {}) {
  return request.put(`/admin/orders/${id}/ship`, payload)
}
