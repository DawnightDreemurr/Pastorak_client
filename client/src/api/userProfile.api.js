import request from '@/utils/request'

/**
 * 获取当前用户资料
 */
export function apiGetUserProfile() {
  return request.get('/user/profile')
}

/**
 * 更新基础资料（姓名、头像、默认地区）
 * body: { name?, avatarKey?, defaultLocation? }
 */
export function apiUpdateUserProfile(payload) {
  return request.put('/user/profile', payload)
}

/**
 * 添加收货地址
 */
export function apiAddAddress(payload) {
  return request.post('/user/addresses', payload)
}

/**
 * 更新收货地址
 */
export function apiUpdateAddress(id, payload) {
  return request.put(`/user/addresses/${id}`, payload)
}

/**
 * 删除收货地址
 */
export function apiDeleteAddress(id) {
  return request.delete(`/user/addresses/${id}`)
}
