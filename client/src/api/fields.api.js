import request from '@/utils/request'

/**
 * 地块列表（可选筛选）
 * GET /api/fields
 * params: { planted?, soilType?, page?, limit? }
 */
export function apiGetFields(params = {}) {
  return request.get('/fields', { params })
}

/**
 * 地块详情
 * GET /api/fields/:id
 */
export function apiGetFieldById(id) {
  return request.get(`/fields/${id}`)
}

/**
 * 新增地块
 * POST /api/fields
 * body: { name, areaMu, soilType, remark? }
 */
export function apiCreateField(payload) {
  return request.post('/fields', payload)
}

/**
 * 更新地块基础信息
 * PUT /api/fields/:id
 */
export function apiUpdateField(id, payload) {
  return request.put(`/fields/${id}`, payload)
}

/**
 * 删除地块
 * DELETE /api/fields/:id
 */
export function apiDeleteField(id) {
  return request.delete(`/fields/${id}`)
}

/**
 * 设置/更新玉米种植计划（开始种植 or 修改播种时间）
 * PUT /api/fields/:id/corn-plan
 */
export function apiUpdateCornPlan(id, payload) {
  return request.put(`/fields/${id}/corn-plan`, payload)
}
