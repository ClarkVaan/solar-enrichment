import { useEffect, useRef } from 'react'
import { loadGoogle, MAP_ID } from '../lib/google'

export default function HouseMap({ lat, lng }) {
  const mapDiv = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function draw() {
      const maps = await loadGoogle()
      const { Map } = await maps.importLibrary('maps')
      const { AdvancedMarkerElement } = await maps.importLibrary('marker')
      if (cancelled) return

      const position = { lat, lng }

      if (!map.current) {
        map.current = new Map(mapDiv.current, {
          center: position,
          zoom: 20,
          mapId: MAP_ID,
          mapTypeId: 'satellite',
          tilt: 0,
          streetViewControl: false,
          fullscreenControl: false,
        })
        marker.current = new AdvancedMarkerElement({ map: map.current, position })
      } else {
        map.current.setCenter(position)
        map.current.setZoom(20)
        marker.current.position = position
      }
    }

    draw()
    return () => {
      cancelled = true
    }
  }, [lat, lng])

  return <div ref={mapDiv} className="map" />
}
