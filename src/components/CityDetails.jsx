import React, { useEffect, useState } from 'react'
import { getForecast } from '../api'
import { useSelector } from 'react-redux'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts'
import MapView from './MapView'

export default function CityDetails({ city, onClose }) {
  const [data, setData] = useState(city)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncedAt, setSyncedAt] = useState(null)
  const unit = useSelector(s => s.prefs.unit)

  useEffect(() => {
    async function load(){
      setLoading(true)
      try {
        const res = await getForecast(city.location.name, 7)
        setData(res)
      } catch(e){ console.error(e) }
      setLoading(false)
    }
    load()
  }, [city.location.name])

  async function handleSync() {
    setSyncing(true)
    try {
      const res = await getForecast(city.location.name, 7)
      setData(res)
      setSyncedAt(new Date())
    } catch (e) {
      console.error('sync error', e)
    } finally {
      setSyncing(false)
    }
  }

  if (!data) return null

  const current = data.current
  const days = data.forecast?.forecastday || []
  const hourly = (days[0]?.hour || []).map(h => ({
    time: h.time.split(' ')[1],
    tempC: h.temp_c,
    tempF: h.temp_f,
    precip: h.chance_of_rain || h.precip_mm
  }))
  const daily = days.map(d => ({
    date: d.date,
    avgC: d.day.avgtemp_c,
    avgF: d.day.avgtemp_f,
    precip: d.day.totalprecip_mm
  }))
  const lineStroke = '#60A5FA'
  const barFill = '#F59E0B'
  const lat = data.location.lat || data.location.latitude || null
  const lon = data.location.lon || data.location.longitude || null

  return (
    <div className="detail-panel">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:20,fontWeight:800}}>{data.location.name}, {data.location.country}</div>
          <div className="small">{data.location.region}</div>
        </div>

        <div style={{textAlign:'right'}}>
          <div style={{fontSize:28,fontWeight:900,color:'#e6f6ff'}}>{Math.round(unit==='C'?current.temp_c:current.temp_f)}°{unit}</div>
          <div className="small" style={{color:'#cfeafc'}}>{current.condition.text}</div>
        </div>
      </div>

      <MapView lat={lat} lon={lon} label={`${data.location.name}`} />

      <div style={{marginTop:16}} className="chart-wrap">
        <div>
          <div className="small" style={{marginBottom:8}}>Hourly temperature (today)</div>
          <div style={{height:260, padding:'6px 0'}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#122434" />
                <XAxis dataKey="time" stroke="#7f96a8" />
                <YAxis stroke="#7f96a8" />
                <Tooltip wrapperStyle={{background:'#06202a'}} />
                <Line type="monotone" dataKey={unit==='C'?'tempC':'tempF'} stroke={lineStroke} strokeWidth={2.4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="small" style={{marginBottom:8}}>7-day average temperature</div>
          <div style={{height:260, padding:'6px 0'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#122434"/>
                <XAxis dataKey="date" stroke="#7f96a8" />
                <YAxis stroke="#7f96a8" />
                <Tooltip wrapperStyle={{background:'#06202a'}} />
                <Bar dataKey={unit==='C'?'avgC':'avgF'} fill={barFill} radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{marginTop:12,display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
        <div className="small">Humidity: {current.humidity}%</div>
        <div className="small">Pressure: {current.pressure_mb} mb</div>
        <div className="small">Wind: {current.wind_kph} kph</div>
        <div className="small">UV: {current.uv}</div>
        <div className="small">Vis: {current.vis_km} km</div>
      </div>

      <div className="detail-controls">
        <div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button className="sync-btn" onClick={handleSync} disabled={syncing}>
            {syncing ? 'Syncing…' : 'Sync'}
          </button>
          {syncedAt && <div className="synced-tag">Synced at {syncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>}
        </div>
      </div>

      {loading && <div className="small" style={{marginTop:10}}>Refreshing…</div>}
    </div>
  )
}
