import React, { useState, useRef } from 'react'
import { searchLocation } from '../api'

export default function SearchBar({ onPick }){
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const timer = useRef(null)

  async function doSearch(value){
    if (!value) { setResults([]); return }
    try {
      const r = await searchLocation(value)
      setResults(r || [])
    } catch(e){
      console.error(e)
    }
  }

  function onChange(e){
    const v = e.target.value
    setQ(v)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(()=>doSearch(v), 400)
  }

  return (
    <div style={{position:'relative'}}>
      <input className="search" value={q} onChange={onChange} placeholder="Search city (autocomplete)" />
      {results.length > 0 && (
        <div style={{position:'absolute',top:40,left:0,background:'#051427',borderRadius:8,padding:8,width:320,boxShadow:'0 6px 18px rgba(0,0,0,.6)'}}>
          {results.slice(0,6).map((r,i)=>(
            <div key={i} style={{padding:'8px 6px',cursor:'pointer'}} onClick={()=>{ onPick(r.name); setQ(''); setResults([]) }}>
              <div style={{fontWeight:700}}>{r.name}</div>
              <div className="small">{r.region} · {r.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
