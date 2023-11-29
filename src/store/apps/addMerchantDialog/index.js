import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null
}

const merchantPopUp = createSlice({
  name: 'merchantPopUp',
  initialState,
  reducers: {
    SET_merchantPopUp: (state, action) => {
      state.data = 'open'
    },
    REMOVE_merchantPopUp: (state, action) => {
      state.data = 'close'
    }
  }
})

export let { SET_merchantPopUp, REMOVE_merchantPopUp } = merchantPopUp.actions

export default merchantPopUp.reducer
