import request from '@/utils/request'

/**
 * 获取当前登录用户信息
 * GET /api/auth/me
 */
export function apiGetMe() {
  return request.get('/auth/me')
}
