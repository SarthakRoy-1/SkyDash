import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addFavorite, removeFavorite, setLastSearched } from '../store/citiesSlice'
import { toggleUnit } from '../store/prefsSlice'
import { getForecast } from '../api'
import CityCard from './CityCard'
import SearchBar from './SearchBar'

export default function Dashboard({ onSelect }) {
  const favs = useSelector(s => s.cities.favorites)
  const unit = useSelector(s => s.prefs.unit)
  const dispatch = useDispatch()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [hint, setHint] = useState('Type a city and press Enter or click a suggestion to load weather.')
  const [currentCoords, setCurrentCoords] = useState(null)
  const [currentLabel, setCurrentLabel] = useState(null)

  async function loadCity(q) {
    setLoading(true)
    setHint('')
    try {
      const res = await getForecast(q, 1)
      if (res && res.location) {
        setCards(prev => {
          const exists = prev.find(p => p.location && p.location.name === res.location.name)
          if (exists) return prev
          return [res, ...prev]
        })
        // if q was coords, capture label for current location
        if (typeof q === 'object' && q.lat != null && q.lon != null && res.location && res.location.name) {
          setCurrentLabel(res.location.name)
        }
      } else {
        setHint('No data returned for that query.')
      }
    } catch (e) {
      console.error(e)
      setHint('Error fetching data. Check your API key and console for details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // request geolocation on first load
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          setCurrentCoords({ lat, lon })
          // pass coordinates directly to API (api.js will format to "lat,lon")
          loadCity({ lat, lon })
        },
        (err) => {
          console.warn('Geolocation denied or unavailable', err)
          // do nothing — user can search manually
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
      )
    }
    // also load favorite cities if any
    favs.forEach(f => loadCity(f))
  }, []) // eslint-disable-line

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-start' }}>
        <SearchBar onPick={(name) => { dispatch(setLastSearched(name)); loadCity(name) }} />
        <button className="btn unit-toggle" onClick={() => dispatch(toggleUnit())}>
          Unit: {unit}
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        {currentCoords && (
          <div className="fav-chips">
            <div className="chip" onClick={() => loadCity(currentCoords)}>
              {currentLabel ? `${currentLabel} (Current)` : 'Current location'}
            </div>
          </div>
        )}
        {favs && favs.length > 0 && (
          <div className="fav-chips" aria-label="favorite-cities">
            {favs.map((f, i) => <div key={i} className="chip" onClick={() => { loadCity(f) }}>{f}</div>)}
          </div>
        )}
      </div>

      {cards.length === 0 && !loading && <div className="empty">{hint}</div>}

      <div className="card-grid" style={{ marginTop: cards.length ? 12 : 0 }}>
        {cards.map((c, i) => (
          <CityCard
            key={i}
            data={c}
            unit={unit}
            onClick={() => onSelect(c)}
            onFav={() => {
              const name = c.location.name
              if (favs.includes(name)) dispatch(removeFavorite(name))
              else dispatch(addFavorite(name))
            }}
            isFav={favs.includes(c.location.name)}
          />
        ))}
      </div>

      {loading && <div className="small">Loading…</div>}
    </div>
  )
}
