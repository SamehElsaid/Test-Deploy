import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  case0: null,
  case1: null,
  case2: null,
  case3: null
}

const BranchData = createSlice({
  name: 'BranchData',
  initialState,
  reducers: {
    SET_BranchData_CASE0: (state, action) => {
      state.case0 = action.payload
    },
    SET_BranchData_CASE1: (state, action) => {
      state.case1 = action.payload
    },
    SET_BranchData_CASE2: (state, action) => {
      state.case2 = action.payload
    },
    SET_BranchData_CASE3: (state, action) => {
      state.case3 = action.payload
    }
  }
})

export let { SET_BranchData, REMOVE_BranchData } = BranchData.actions

export default BranchData.reducer
