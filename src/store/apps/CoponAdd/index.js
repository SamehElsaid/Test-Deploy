import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null
}

const CoponAdd = createSlice({
  name: 'CoponAdd',
  initialState,
  reducers: {
    SET_Coupon: (state, action) => {
      state.data = action.payload
    },
    REMOVE_Coupon: (state, action) => {
      state.data = null
    }
  }
})

export let { SET_Coupon, REMOVE_Coupon } = CoponAdd.actions

export default CoponAdd.reducer
