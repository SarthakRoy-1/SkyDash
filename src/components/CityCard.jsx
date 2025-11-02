import React from 'react'
export default function CityCard({ data, unit, onClick, onFav, isFav }){
  const loc = data.location
  const cur = data.current
  if (!loc || !cur) {
    return (
      <div className="city-card">
        <div className="skeleton" style={{height:80}}></div>
        <div style={{height:10}}></div>
        <div className="skeleton" style={{height:16,width:'60%'}}></div>
      </div>
    )
  }
  const temp = unit === 'C' ? cur.temp_c : cur.temp_f
  const icon = cur.condition && cur.condition.icon ? <img src={cur.condition.icon} alt="" style={{width:56,height:56}}/> : <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5" stroke="#7dd3fc" strokeWidth="1.4"/></svg>
  return (
    <div className="city-card" onClick={onClick} role="button">
      <div className="city-top">
        <div className="city-meta">
          <div className="city-name">{loc.name}, {loc.country}</div>
          <div className="small">{loc.region}</div>
        </div>

        <div style={{textAlign:'right'}}>
          <div className="temp">{Math.round(temp)}°{unit}</div>
          <div className="cond small">{cur.condition.text}</div>
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:14}}>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          {icon}
          <div className="small">Humidity: {cur.humidity}% · Wind: {cur.wind_kph} kph</div>
        </div>

        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
          <button className={"btn " + (isFav ? 'favorite' : '')} onClick={(e)=>{e.stopPropagation(); onFav()}}>{isFav? 'Unfavorite' : 'Favorite'}</button>
          <div className="small">Updated: {new Date(cur.last_updated).toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
