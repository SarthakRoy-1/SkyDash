import axios from 'axios'

const KEY = import.meta.env.VITE_WEATHERAPI_KEY
if (!KEY) {
  console.warn('VITE_WEATHERAPI_KEY not set — requests will fail. Add it to .env')
}
const BASE = 'https://api.weatherapi.com/v1'
const TTL = 60 * 1000 // 60 seconds

function cacheKey(url){
  return 'wa_cache:' + url
}

function qToParam(q) {
  if (!q) return ''
  if (typeof q === 'object' && q.lat != null && q.lon != null) {
    return `${q.lat},${q.lon}`
  }
  return q
}

async function cachedGet(url, params){
  const full = url + JSON.stringify(params || {})
  const k = cacheKey(full)
  try {
    const raw = localStorage.getItem(k)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Date.now() - parsed._ts < TTL) {
        return parsed.data
      }
    }
  } catch(e){}
  const res = await axios.get(url, { params })
  const payload = res.data
  try {
    localStorage.setItem(k, JSON.stringify({_ts: Date.now(), data: payload}))
  } catch(e){}
  return payload
}

export async function searchLocation(q){
  const url = BASE + '/search.json'
  const qp = qToParam(q)
  return cachedGet(url, { key: KEY, q: qp })
}

export async function getForecast(q, days = 7){
  const url = BASE + '/forecast.json'
  const qp = qToParam(q)
  return cachedGet(url, { key: KEY, q: qp, days, aq: 'no' , alerts: 'no' })
}
