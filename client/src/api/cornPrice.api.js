import request from '@/utils/request'

/**
 * 支持地区（与后端保持一致）
 */
export const CORN_PRICE_REGIONS = [
  '全国',
  '河北',
  '山西',
  '内蒙古',
  '辽宁',
  '吉林',
  '黑龙江',
  '山东',
  '河南',
]

/**
 * 获取某地区玉米价格序列
 *
 * GET /api/market/corn?region=吉林&limit=7
 *
 * @param {string} region 地区
 * @param {number} limit  返回期数（默认7，最大30）
 */
export function apiGetCornPriceSeries(region = '全国', limit = 7) {
  return request.get('/market/corn', {
    params: {
      region,
      limit,
    },
  })
}
