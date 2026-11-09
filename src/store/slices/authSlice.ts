import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserProfile, UserRole } from '@/types/domain'

export interface AuthState {
  token: string | null
  user: UserProfile | null
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  seeker: {
    id: 'usr-seeker-1',
    name: 'Tunde Bakare',
    email: 'tunde.bakare@oruvia.ng',
    phone: '+234 803 412 8890',
    role: 'seeker',
    verified: true,
    rating: 4.9,
    reviewCount: 7,
    responseRate: 98,
    responseTime: 'within an hour',
    joinedAt: '2025-02-14T10:00:00Z',
    listingsCount: 0,
  },
  agent: {
    id: 'usr-agent-1',
    name: 'Adebayo Ogunlesi',
    email: 'adebayo@ogunprimehomes.ng',
    phone: '+234 809 550 1122',
    role: 'agent',
    verified: true,
    agencyName: 'Ogun & Lekki Prime Realty',
    bio: 'NIA-registered real estate consultant specialising in verified residential homes across Abeokuta, Mowe-Ofada, and Lekki.',
    rating: 4.94,
    reviewCount: 42,
    responseRate: 99,
    responseTime: 'within 15 mins',
    joinedAt: '2024-05-10T09:00:00Z',
    listingsCount: 14,
  },
  landlord: {
    id: 'usr-landlord-1',
    name: 'Chief (Mrs.) Folake Adeyemi',
    email: 'folake.adeyemi@oruvia.ng',
    phone: '+234 802 311 4500',
    role: 'landlord',
    verified: true,
    bio: 'Direct property owner in Ibara GRA, Abeokuta and Ikeja GRA. Transparent tenancy terms with zero inflated middleman fees.',
    rating: 4.88,
    reviewCount: 19,
    responseRate: 95,
    responseTime: 'within 30 mins',
    joinedAt: '2024-08-01T12:00:00Z',
    listingsCount: 5,
  },
  admin: {
    id: 'usr-admin-1',
    name: 'Damilola Oruvia Trust',
    email: 'trust@oruvia.ng',
    phone: '+234 700 678 8420',
    role: 'admin',
    verified: true,
    rating: 5.0,
    reviewCount: 0,
    responseRate: 100,
    responseTime: 'instant',
    joinedAt: '2024-01-01T00:00:00Z',
    listingsCount: 0,
  },
}

const initialState: AuthState = {
  token: 'demo-jwt-token',
  user: DEMO_USERS.agent,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ token: string; user: UserProfile }>) {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    switchDemoRole(state, action: PayloadAction<UserRole>) {
      state.token = 'demo-jwt-token'
      state.user = DEMO_USERS[action.payload]
    },
    logout(state) {
      state.token = null
      state.user = null
    },
  },
})

export const { setSession, switchDemoRole, logout } = authSlice.actions
export { DEMO_USERS }
export default authSlice.reducer

