import { useEffect, useRef, useState } from 'react'
import { loadGoogle } from '../lib/google'

export default function AddressSearch({ onSelect }) {
  const boxRef = useRef(null)
  const [error, setError] = useState('')

  // keep latest callback without re-creating the widget
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    let input
    let cancelled = false

    async function setup() {
      try {
        const maps = await loadGoogle()
        const { PlaceAutocompleteElement } = await maps.importLibrary('places')
        if (cancelled) return

        input = new PlaceAutocompleteElement()
        input.placeholder = 'Start typing an address...'
        boxRef.current.appendChild(input)

        input.addEventListener('gmp-select', async ({ placePrediction }) => {
          const place = placePrediction.toPlace()
          await place.fetchFields({ fields: ['formattedAddress', 'location'] })

          onSelectRef.current({
            address: place.formattedAddress,
            lat: place.location.lat(),
            lng: place.location.lng(),
          })
        })
      } catch (err) {
        setError(err.message)
      }
    }

    setup()

    return () => {
      cancelled = true
      if (input) input.remove()
    }
  }, [])

  return (
    <div className="search">
      <label>Address</label>
      <div ref={boxRef} className="search-box" />
      {error && <p className="error">{error}</p>}
    </div>
  )
}
