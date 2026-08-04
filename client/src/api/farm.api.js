import request from '@/utils/request'

/**
 * 刷新农事通知（扫描地块->阶段->写通知）
 * GET /api/farm/refresh
 */
export function apiRefreshFarmNotices() {
  return request.get('/farm/refresh')
}
