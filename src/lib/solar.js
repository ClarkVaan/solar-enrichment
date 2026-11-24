import { API_KEY } from './google'

const BASE = 'https://solar.googleapis.com/v1/buildingInsights:findClosest'

// Not every house has HIGH quality imagery, so step down until we get something
const QUALITIES = ['HIGH', 'MEDIUM', 'LOW']

export async function getBuildingInsights(lat, lng) {
  let lastError

  for (const quality of QUALITIES) {
    const params = new URLSearchParams({
      'location.latitude': lat.toFixed(6),
      'location.longitude': lng.toFixed(6),
      requiredQuality: quality,
      key: API_KEY,
    })

    const res = await fetch(`${BASE}?${params}`)
    const body = await res.json()

    if (res.ok) return body

    lastError = body?.error?.message || `Solar API error (${res.status})`

    // 404 means no data at this quality, anything else is a real problem
    if (res.status !== 404) break
  }

  throw new Error(lastError)
}
