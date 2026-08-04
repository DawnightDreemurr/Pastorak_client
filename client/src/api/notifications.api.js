import request from '@/utils/request'

/**
 * 通知列表（分页/类型/未读）
 * GET /api/notifications
 * params: { type?, unread?, page?, limit? }
 */
export function apiGetNotifications(params = {}) {
  return request.get('/notifications', { params })
}

/**
 * 未读数量
 * GET /api/notifications/unread-count
 */
export function apiGetUnreadCount() {
  return request.get('/notifications/unread-count')
}

/**
 * 标记单条已读
 * PUT /api/notifications/:id/read
 */
export function apiMarkNotificationRead(id) {
  return request.put(`/notifications/${id}/read`)
}

/**
 * 全部标记已读
 * PUT /api/notifications/read-all
 */
export function apiMarkAllNotificationsRead() {
  return request.put('/notifications/read-all')
}
/**
 * 删除单条通知
 * DELETE /api/notifications/:id
 */
export function apiDeleteNotification(id) {
  return request.delete(`/notifications/${id}`)
}

/**
 * 清空已读通知
 * DELETE /api/notifications/clear-read
 */
export function apiClearReadNotifications() {
  return request.delete('/notifications/clear-read')
}
