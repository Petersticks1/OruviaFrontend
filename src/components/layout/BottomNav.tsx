import { Link, useRouterState } from '@tanstack/react-router'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { useAppSelector } from '@/store/hooks'

interface NavTab {
  to: string
  label: string
  icon: IconName
  badge?: number
}

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const savedCount = useAppSelector((state) => state.ui.savedListingIds.length)
  const user = useAppSelector((state) => state.auth.user)

  const tabs: NavTab[] = [
    { to: '/', label: 'Explore', icon: 'search' },
    { to: '/saved', label: 'Saved', icon: 'heart', badge: savedCount || undefined },
    { to: '/inbox', label: 'Inbox', icon: 'chat' },
    {
      to: user
        ? user.role === 'agent' || user.role === 'landlord'
          ? '/dashboard'
          : '/inspections'
        : '/login',
      label: user ? (user.role === 'seeker' ? 'Account' : 'Dashboard') : 'Log in',
      icon: 'user',
    },
  ]

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md md:hidden"
    >
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const isActive =
            tab.to === '/' ? pathname === '/' : pathname.startsWith(tab.to)

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors',
                isActive ? 'text-brand-500' : 'text-ink-500 hover:text-ink-900',
              )}
            >
              <span className="relative">
                <Icon name={tab.icon} size={22} />
                {tab.badge ? (
                  <span className="absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-surface">
                    {tab.badge}
                  </span>
                ) : null}
              </span>
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
