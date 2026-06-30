import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/Userslice'
import cartReducer from '../features/cartSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
})