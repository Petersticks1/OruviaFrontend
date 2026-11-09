import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface FooterSection {
  id: string
  title: string
  links: { label: string; to: string }[]
}

const FOOTER_SECTIONS: readonly FooterSection[] = [
  {
    id: 'support',
    title: 'Support & Trust',
    links: [
      { label: 'How Oruvia Verification Works', to: '/verify' },
      { label: 'Virtual & Physical Inspections', to: '/inspections' },
      { label: 'Zero Fake Listings Guarantee', to: '/search' },
      { label: 'Report a Suspicious Agent', to: '/notifications' },
    ],
  },
  {
    id: 'company',
    title: 'Oruvia Marketplace',
    links: [
      { label: 'Explore Ogun & Lagos Homes', to: '/' },
      { label: 'Design System & Components', to: '/design-system' },
      { label: 'Admin Trust & Moderation', to: '/admin' },
      { label: 'Saved Wishlists', to: '/saved' },
    ],
  },
  {
    id: 'listers',
    title: 'For Agents & Landlords',
    links: [
      { label: 'Publish a Listing in < 3 mins', to: '/dashboard/listings/new' },
      { label: 'Lister Performance Dashboard', to: '/dashboard' },
      { label: 'Manage Inspection Requests', to: '/dashboard/inspections' },
      { label: 'Get Oruvia Verified Badge', to: '/verify' },
    ],
  },
]

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>('support')

  return (
    <footer className="mt-16 border-t border-line bg-surface-muted pb-20 md:pb-10">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
        {/* Desktop 3-Column + Mobile Accordion */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-10">
          {FOOTER_SECTIONS.map((sec) => {
            const isOpen = openSection === sec.id
            return (
              <div key={sec.id} className="border-b border-line pb-4 md:border-b-0 md:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : sec.id)}
                  className="flex w-full items-center justify-between text-left text-sm font-bold text-ink-900 md:cursor-default"
                >
                  <span>{sec.title}</span>
                  <span className="md:hidden">
                    <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} size={18} />
                  </span>
                </button>
                <ul
                  className={cn(
                    'mt-3 space-y-2.5 text-sm text-ink-700',
                    isOpen ? 'block' : 'hidden md:block',
                  )}
                >
                  {sec.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="hover:text-ink-900 hover:underline underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* PRD Roadmap Callout */}
        <div className="mt-8 rounded-[var(--radius-md)] border border-line bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon name="sparkles" size={18} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Oruvia Product Roadmap (Coming Soon)
                </p>
                <p className="text-xs text-ink-700">
                  Mortgage & rent-to-own financing · E-signed tenancy agreements · AI Naira price
                  estimation · 3D/VR tours · Escrow rent protection
                </p>
              </div>
            </div>
            <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-ink-700">
              Ogun Digital Summit Proptech Track
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-ink-500 sm:flex-row">
          <p>
            © {CURRENT_YEAR} Oruvia (òrùlé + via — “your path to a roof”). Built for
            Nigeria.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 font-medium text-ink-900">
              <Icon name="globe" size={15} /> English (NG)
            </span>
            <span className="font-semibold text-ink-900">₦ NGN</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
