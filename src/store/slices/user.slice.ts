"use client"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface UserState {
  auth?: boolean
  email?: string | undefined
  password?: string | undefined
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
    }
  }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer