import { useState } from 'react'

const SQFT = 10.7639

function num(n, digits = 0) {
  if (n == null || isNaN(n)) return '-'
  return n.toLocaleString(undefined, { maximumFractionDigits: digits })
}

function compass(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

function formatDate(d) {
  if (!d) return '-'
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
}

export default function SolarInfo({ data }) {
  const sp = data.solarPotential || {}
  const configs = sp.solarPanelConfigs || []
  const segments = sp.roofSegmentStats || []

  const [configIndex, setConfigIndex] = useState(configs.length - 1)
  const config = configs[configIndex]

  const roofArea = sp.wholeRoofStats?.areaMeters2
  const panelWatts = sp.panelCapacityWatts || 0

  const systemKw = config ? (config.panelsCount * panelWatts) / 1000 : 0
  const yearlyKwh = config?.yearlyEnergyDcKwh
  const co2Kg = yearlyKwh && sp.carbonOffsetFactorKgPerMwh
    ? (yearlyKwh / 1000) * sp.carbonOffsetFactorKgPerMwh
    : null

  return (
    <div className="solar">
      <h2>Roof overview</h2>
      <table className="facts">
        <tbody>
          <tr>
            <th>Roof area</th>
            <td>{num(roofArea * SQFT)} ft² ({num(roofArea)} m²)</td>
          </tr>
          <tr>
            <th>Roof segments</th>
            <td>{segments.length}</td>
          </tr>
          <tr>
            <th>Max panels that fit</th>
            <td>{num(sp.maxArrayPanelsCount)}</td>
          </tr>
          <tr>
            <th>Max sunshine</th>
            <td>{num(sp.maxSunshineHoursPerYear)} hrs / year</td>
          </tr>
          <tr>
            <th>Panel size used</th>
            <td>
              {panelWatts} W, {sp.panelHeightMeters} x {sp.panelWidthMeters} m
            </td>
          </tr>
          <tr>
            <th>Imagery</th>
            <td>
              {formatDate(data.imageryDate)} ({data.imageryQuality?.toLowerCase()} quality)
            </td>
          </tr>
        </tbody>
      </table>

      {config && (
        <>
          <h2>Panel setup</h2>
          <div className="panels">
            <label htmlFor="panels">
              Panels: <b>{config.panelsCount}</b>
            </label>
            <input
              id="panels"
              type="range"
              min="0"
              max={configs.length - 1}
              value={configIndex}
              onChange={(e) => setConfigIndex(Number(e.target.value))}
            />
          </div>
          <table className="facts">
            <tbody>
              <tr>
                <th>System size</th>
                <td>{num(systemKw, 2)} kW</td>
              </tr>
              <tr>
                <th>Yearly energy (DC)</th>
                <td>{num(yearlyKwh)} kWh</td>
              </tr>
              <tr>
                <th>CO₂ offset</th>
                <td>{co2Kg ? `${num(co2Kg)} kg / year` : '-'}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {segments.length > 0 && (
        <>
          <h2>Roof segments</h2>
          <table className="segments">
            <thead>
              <tr>
                <th>#</th>
                <th>Facing</th>
                <th>Pitch</th>
                <th>Area</th>
                <th>Sunshine (median)</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((s, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    {compass(s.azimuthDegrees)} ({num(s.azimuthDegrees)}°)
                  </td>
                  <td>{num(s.pitchDegrees, 1)}°</td>
                  <td>{num(s.stats?.areaMeters2 * SQFT)} ft²</td>
                  <td>{num(s.stats?.sunshineQuantiles?.[5])} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <details>
        <summary>Raw response</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  )
}
