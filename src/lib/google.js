export const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
export const MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID || 'DEMO_MAP_ID'

let loading = null

// Load the Maps JS script once and reuse it everywhere
export function loadGoogle() {
  if (loading) return loading

  loading = new Promise((resolve, reject) => {
    if (window.google?.maps?.importLibrary) {
      resolve(window.google.maps)
      return
    }

    window.__onGoogleLoad = () => resolve(window.google.maps)

    const script = document.createElement('script')
    script.src =
      'https://maps.googleapis.com/maps/api/js' +
      `?key=${API_KEY}&v=weekly&loading=async&callback=__onGoogleLoad`
    script.async = true
    script.onerror = () => {
      loading = null
      reject(new Error('Google Maps failed to load'))
    }
    document.head.appendChild(script)
  })

  return loading
}
