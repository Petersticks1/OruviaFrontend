import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { NotificationItem } from '@/components/cards/NotificationItem'
import { PageContainer } from '@/components/shared/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Button } from '@/components/ui/Button'
import { notificationsQueryOptions } from '@/features/listings/api/queries'

export default function NotificationsView() {
  const navigate = useNavigate()
  const { data: initialNotifications = [] } = useQuery(notificationsQueryOptions())
  const [readIds, setReadIds] = useState<string[]>([])

  const notifications = initialNotifications.map((n) => ({
    ...n,
    read: n.read || readIds.includes(n.id),
  }))

  return (
    <PageContainer narrow className="py-8 space-y-6">
      <SectionHeader
        eyebrow="Activity Center"
        title="Notifications"
        subtitle="Real-time updates on your inspection requests, messages, and ID verification."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReadIds(notifications.map((n) => n.id))}
          >
            Mark all as read
          </Button>
        }
      />

      <div className="space-y-3">
        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onSelect={(item) => {
              setReadIds((prev) => [...prev, item.id])
              if (item.actionHref) {
                navigate({ to: item.actionHref })
              }
            }}
          />
        ))}
      </div>
    </PageContainer>
  )
}

