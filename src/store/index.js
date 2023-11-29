// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import mapSlice from 'src/store/apps/mapSlice'
import PolygonmapSlice from 'src/store/apps/PolygonmapSlice'
import merchantPopUp from 'src/store/apps/addMerchantDialog'
import CouponAdd from 'src/store/apps/CoponAdd'
import BranchData from 'src/store/apps/BranchData'
import auth from './apps/authSlice/authSlice'

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    mapSlice,
    PolygonmapSlice,
    merchantPopUp,
    CouponAdd,
    BranchData,
    auth
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
