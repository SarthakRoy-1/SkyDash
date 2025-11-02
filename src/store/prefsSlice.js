import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  unit: localStorage.getItem('wa_unit') || 'C' // 'C' or 'F'
}

const prefs = createSlice({
  name: 'prefs',
  initialState,
  reducers: {
    toggleUnit(state) {
      state.unit = state.unit === 'C' ? 'F' : 'C'
      localStorage.setItem('wa_unit', state.unit)
    }
  }
})

export const { toggleUnit } = prefs.actions
export default prefs.reducer
