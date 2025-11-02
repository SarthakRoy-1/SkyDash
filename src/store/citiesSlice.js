import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  favorites: JSON.parse(localStorage.getItem('wa_favs') || '[]'),
  lastSearched: null
}

const cities = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    addFavorite(state, action) {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload)
        localStorage.setItem('wa_favs', JSON.stringify(state.favorites))
      }
    },
    removeFavorite(state, action) {
      state.favorites = state.favorites.filter(c => c !== action.payload)
      localStorage.setItem('wa_favs', JSON.stringify(state.favorites))
    },
    setLastSearched(state, action) {
      state.lastSearched = action.payload
    }
  }
})

export const { addFavorite, removeFavorite, setLastSearched } = cities.actions
export default cities.reducer
