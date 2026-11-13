import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import {
  ErrorBoundary,
  RouteErrorFallback,
  RoutePendingSkeleton,
} from '@/components/layout/ErrorBoundary'
import { store } from '@/store'
import { addToast } from '@/store/slices/uiSlice'

const ExploreView = lazy(() => import('./views/ExploreView'))
const SearchView = lazy(() => import('./views/SearchView'))
const ListingDetailView = lazy(() => import('./views/ListingDetailView'))
const SavedView = lazy(() => import('./views/SavedView'))
const InboxView = lazy(() => import('./views/InboxView'))
const InspectionsView = lazy(() => import('./views/InspectionsView'))
const NotificationsView = lazy(() => import('./views/NotificationsView'))
const DashboardView = lazy(() => import('./views/DashboardView'))
const ListingEditorView = lazy(() => import('./views/ListingEditorView'))
const ProfileView = lazy(() => import('./views/ProfileView'))
const VerifyView = lazy(() => import('./views/VerifyView'))
const AdminView = lazy(() => import('./views/AdminView'))
const AuthView = lazy(() => import('./views/AuthView'))
const DesignSystemView = lazy(() => import('./views/DesignSystemView'))
const NotFoundView = lazy(() => import('./views/NotFoundView'))

function requireAuthGuard() {
  const { user } = store.getState().auth
  if (!user) {
    store.dispatch(
      addToast({
        title: 'Sign in required',
        description: 'Please log in to access this page.',
        tone: 'info',
      }),
    )
    throw redirect({ to: '/login' })
  }
}

function requireListerGuard() {
  const { user } = store.getState().auth
  if (!user) {
    throw redirect({ to: '/login' })
  }
  if (user.role !== 'agent' && user.role !== 'landlord' && user.role !== 'admin') {
    store.dispatch(
      addToast({
        title: 'Agent or Landlord account required',
        description: 'Sign in with an Agent or Landlord account to access the Lister Dashboard.',
        tone: 'info',
      }),
    )
    throw redirect({ to: '/' })
  }
}

function requireAdminGuard() {
  const { user } = store.getState().auth
  if (!user) {
    throw redirect({ to: '/login' })
  }
  if (user.role !== 'admin') {
    store.dispatch(
      addToast({
        title: 'Admin access required',
        description: 'Sign in with an Admin account to view /admin.',
        tone: 'info',
      }),
    )
    throw redirect({ to: '/' })
  }
}

const rootRoute = createRootRoute({
  component: () => (
    <ErrorBoundary>
      <AppShell>
        <Suspense fallback={<RoutePendingSkeleton />}>
          <Outlet />
        </Suspense>
      </AppShell>
    </ErrorBoundary>
  ),
  pendingComponent: RoutePendingSkeleton,
  errorComponent: RouteErrorFallback,
  notFoundComponent: () => (
    <Suspense fallback={<RoutePendingSkeleton />}>
      <NotFoundView />
    </Suspense>
  ),
})

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ExploreView,
})

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchView,
})

const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listing/$listingId',
  component: ListingDetailView,
})

const savedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/saved',
  beforeLoad: requireAuthGuard,
  component: SavedView,
})

const inboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inbox',
  beforeLoad: requireAuthGuard,
  component: InboxView,
})

const inboxThreadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inbox/$threadId',
  beforeLoad: requireAuthGuard,
  component: InboxView,
})

const inspectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inspections',
  beforeLoad: requireAuthGuard,
  component: InspectionsView,
})

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  beforeLoad: requireAuthGuard,
  component: NotificationsView,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: requireListerGuard,
  component: DashboardView,
})

const dashboardNewListingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/listings/new',
  beforeLoad: requireListerGuard,
  component: ListingEditorView,
})

const dashboardEditListingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/listings/$listingId/edit',
  beforeLoad: requireListerGuard,
  component: ListingEditorView,
})

const dashboardInspectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/inspections',
  beforeLoad: requireListerGuard,
  component: InspectionsView,
})

const dashboardInquiriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/inquiries',
  beforeLoad: requireListerGuard,
  component: InboxView,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$userId',
  component: ProfileView,
})

const verifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify',
  beforeLoad: requireAuthGuard,
  component: VerifyView,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: requireAdminGuard,
  component: AdminView,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: AuthView,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: AuthView,
})

const designSystemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/design-system',
  component: DesignSystemView,
})

const routeTree = rootRoute.addChildren([
  exploreRoute,
  searchRoute,
  listingDetailRoute,
  savedRoute,
  inboxRoute,
  inboxThreadRoute,
  inspectionsRoute,
  notificationsRoute,
  dashboardRoute,
  dashboardNewListingRoute,
  dashboardEditListingRoute,
  dashboardInspectionsRoute,
  dashboardInquiriesRoute,
  profileRoute,
  verifyRoute,
  adminRoute,
  loginRoute,
  signupRoute,
  designSystemRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

