import request from '@/utils/request'

/**
 * OCR 识别（传图片 URL）
 * POST /api/ai/ocr
 * body: { url }
 */
export function apiOcrByUrl(url) {
  return request.post('/ai/ocr', { url })
}

/**
 * 植物识别（传图片 URL）
 * 后端当前从 req.query 取 url
 * POST /api/ai/plantbyurl?url=xxx
 */
export function apiPlantIdentifyByUrl(url) {
  return request.post('/ai/plantbyurl', null, {
    params: { url },
  })
}

/**
 * 植物识别（传文件 File）
 * POST /api/ai/plantbyfile
 * form-data:
 *   file
 *   topN
 *   baikeNum
 */
export function apiPlantIdentifyByFile(file, topN = 5, baikeNum = 5) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('topN', String(topN))
  formData.append('baikeNum', String(baikeNum))

  return request.post('/ai/plantbyfile', formData)
}
