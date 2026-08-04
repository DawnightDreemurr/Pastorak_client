import request from '@/utils/request'

/**
 * 实时天气
 * GET /api/weather/now?location=xxx
 */
export function apiGetWeatherNow(params = {}) {
  return request.get('/weather/now', { params })
}

/**
 * 每日预报
 * GET /api/weather/daily?location=xxx
 */
export function apiGetDailyWeather(params = {}) {
  return request.get('/weather/daily', { params })
}

/**
 * 每小时预报
 * GET /api/weather/hourly?location=xxx
 */
export function apiGetHourlyWeather(params = {}) {
  return request.get('/weather/hourly', { params })
}

/**
 * 分钟级降水
 * GET /api/weather/minutely?location=xxx
 */
export function apiGetMinutePrecipitation(params = {}) {
  return request.get('/weather/minutely', { params })
}

/**
 * 天气指数预报
 * GET /api/weather/index?location=xxx
 */
export function apiGetWeatherIndexForecast(params = {}) {
  return request.get('/weather/index', { params })
}

/**
 * 实时空气质量
 * GET /api/weather/air?location=xxx
 */
export function apiGetNowAirQuality(params = {}) {
  return request.get('/weather/air', { params })
}

/**
 * 实时天气预警
 * GET /api/weather/alert?location=xxx
 */
export function apiGetWeatherAlert(params = {}) {
  return request.get('/weather/alert', { params })
}
