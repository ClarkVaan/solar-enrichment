import { useState } from 'react'
import AddressSearch from './components/AddressSearch'
import HouseMap from './components/HouseMap'
import SolarInfo from './components/SolarInfo'
import { API_KEY } from './lib/google'
import { getBuildingInsights } from './lib/solar'

export default function App() {
  const [place, setPlace] = useState(null)
  const [solar, setSolar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSelect(p) {
    setPlace(p)
    setSolar(null)
    setError('')
    setLoading(true)

    try {
      const data = await getBuildingInsights(p.lat, p.lng)
      setSolar(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!API_KEY) {
    return (
      <main>
        <h1>Solar Enrichment</h1>
        <p className="error">
          No API key found. Copy <code>.env.example</code> to <code>.env</code>,
          add your Google key and restart the dev server.
        </p>
      </main>
    )
  }

  return (
    <main>
      <h1>Solar Enrichment</h1>
      <p className="sub">Search a house to see its roof and solar potential.</p>

      <AddressSearch onSelect={handleSelect} />

      {place && (
        <section className="result">
          <h3>{place.address}</h3>
          <HouseMap lat={place.lat} lng={place.lng} />

          {loading && <p>Loading solar data...</p>}
          {error && <p className="error">{error}</p>}
          {solar && <SolarInfo key={solar.name} data={solar} />}
        </section>
      )}
    </main>
  )
}
