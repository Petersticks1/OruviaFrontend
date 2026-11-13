import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserProfile } from '@/types/domain'

const AUTH_STORAGE_KEY = 'oruvia_auth_session'

export interface AuthState {
  token: string | null
  user: UserProfile | null
}

function loadPersistedAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return { token: null, user: null }
    const parsed = JSON.parse(raw) as Partial<AuthState>
    if (typeof parsed.token === 'string' && parsed.token && parsed.user) {
      return { token: parsed.token, user: parsed.user }
    }
  } catch {
    // Ignore storage read errors
  }
  return { token: null, user: null }
}

function persistAuth(state: AuthState): void {
  try {
    if (state.token && state.user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  } catch {
    // Ignore storage write errors
  }
}

const initialState: AuthState = loadPersistedAuth()

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ token: string; user: UserProfile }>) {
      state.token = action.payload.token
      state.user = action.payload.user
      persistAuth({ token: state.token, user: state.user })
    },
    updateUserProfile(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload
      persistAuth({ token: state.token, user: state.user })
    },
    logout(state) {
      state.token = null
      state.user = null
      persistAuth({ token: null, user: null })
    },
  },
})

export const { setSession, updateUserProfile, logout } = authSlice.actions
export default authSlice.reducer
