"use client"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface UserState {
  auth?: boolean
  email?: string
  password?: string
  token?: string
}

const initialState: UserState = {
  auth: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.auth = action.payload.auth
      state.email = action.payload.email
      state.password = action.payload.password
      state.token = action.payload.token
    }
  }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer