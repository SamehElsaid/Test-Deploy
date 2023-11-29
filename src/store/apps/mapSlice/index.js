import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null
}

const map = createSlice({
  name: 'map',
  initialState,
  reducers: {
    SET_map: (state, action) => {
      state.data = action.payload
    },
    REMOVE_map: (state, action) => {
      state.data = null
    }
  }
})

export let { SET_map, REMOVE_map } = map.actions

export default map.reducer
