import { configureStore } from '@reduxjs/toolkit'
import prefsReducer from './prefsSlice'
import citiesReducer from './citiesSlice'

const store = configureStore({
  reducer: {
    prefs: prefsReducer,
    cities: citiesReducer
  }
})

export default store
