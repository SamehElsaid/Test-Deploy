import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null
}

const PolygonmapSlice = createSlice({
  name: 'PolygonmapSlice',
  initialState,
  reducers: {
    SET_map_Polygon: (state, action) => {
      state.data = action.payload
    },
    REMOVE_map_Polygon: (state, action) => {
      state.data = null
    }
  }
})

export let { SET_map_Polygon, REMOVE_map_Polygon } = PolygonmapSlice.actions

export default PolygonmapSlice.reducer
