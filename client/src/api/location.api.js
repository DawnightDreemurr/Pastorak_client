import request from '@/utils/request'

export function getLocation(params) {
  return request.get('/location', { params })
}
