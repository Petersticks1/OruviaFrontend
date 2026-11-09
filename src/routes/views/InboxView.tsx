import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { SectionCard } from '@/components/cards/SectionCard'
import { ThreadCard } from '@/components/cards/ThreadCard'
import { PageContainer } from '@/components/shared/PageContainer'
import { PriceTag } from '@/components/shared/PriceTag'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { threadsQueryOptions } from '@/features/listings/api/queries'
import { formatRelativeDate } from '@/lib/formatters'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addToast } from '@/store/slices/uiSlice'
import type { MessageItem } from '@/types/domain'

export default function InboxView() {
  const params = useParams({ strict: false }) as { threadId?: string }
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { data: threads = [] } = useQuery(threadsQueryOptions())

  const activeThreadId = params.threadId ?? threads[0]?.id ?? 'thr-1'
  const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0]

  const [draft, setDraft] = useState('')
  const [localReplies, setLocalReplies] = useState<Record<string, MessageItem[]>>({})

  const allMessages = activeThread
    ? [...activeThread.messages, ...(localReplies[activeThread.id] ?? [])]
    : []

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.trim() || !activeThread) return

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      threadId: activeThread.id,
      senderId: user?.id ?? 'usr-seeker-1',
      senderName: user?.name ?? 'You',
      body: draft.trim(),
      createdAt: new Date().toISOString(),
    }

    setLocalReplies((prev) => ({
      ...prev,
      [activeThread.id]: [...(prev[activeThread.id] ?? []), newMsg],
    }))
    setDraft('')
    dispatch(
      addToast({
        title: 'Message sent',
        description: `${activeThread.participantName} typically responds within 30 minutes.`,
        tone: 'success',
      }),
    )
  }

  return (
    <PageContainer className="py-8 space-y-6">
      <SectionHeader
        eyebrow="In-App Messaging"
        title="Messages & Property Inquiries"
        subtitle="Communicate directly with verified landlords and agents, or continue on WhatsApp."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          {threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              active={thread.id === activeThread?.id}
              onSelect={(id) => navigate({ to: '/inbox/$threadId', params: { threadId: id } })}
            />
          ))}
        </div>

        <div className="lg:col-span-7">
          {activeThread ? (
            <SectionCard
              title={activeThread.participantName}
              subtitle={`Inquiry on: ${activeThread.listingTitle}`}
              action={
                <div className="flex items-center gap-2">
                  {activeThread.participantVerified ? <VerifiedBadge compact /> : null}
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon="whatsapp"
                    onClick={() =>
                      window.open(
                        `https://wa.me/${activeThread.participantPhone}?text=${encodeURIComponent(`Hi ${activeThread.participantName}, following up on "${activeThread.listingTitle}" on Oruvia.`)}`,
                        '_blank',
                      )
                    }
                  >
                    WhatsApp
                  </Button>
                </div>
              }
            >
              <div className="mb-4 flex items-center justify-between rounded-[var(--radius-sm)] bg-surface-muted p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeThread.listingImage}
                    alt={activeThread.listingTitle}
                    width={64}
                    height={48}
                    className="h-12 w-16 rounded object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-ink-900">{activeThread.listingTitle}</p>
                    <PriceTag
                      amount={activeThread.listingPrice}
                      period={activeThread.listingType === 'rent' ? 'year' : 'total'}
                      size="sm"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate({
                      to: '/listing/$listingId',
                      params: { listingId: activeThread.listingId },
                    })
                  }
                >
                  View listing
                </Button>
              </div>

              <div className="max-h-80 space-y-3 overflow-y-auto py-2">
                {allMessages.map((msg) => {
                  const isMine = msg.senderId === (user?.id ?? 'usr-seeker-1')
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-[var(--radius-md)] px-4 py-2.5 text-sm ${
                          isMine
                            ? 'bg-ink-900 text-surface'
                            : 'border border-line bg-surface-muted text-ink-900'
                        }`}
                      >
                        <p>{msg.body}</p>
                      </div>
                      <span className="mt-1 text-[11px] text-ink-500">
                        {msg.senderName} · {formatRelativeDate(msg.createdAt)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <form onSubmit={handleSend} className="mt-4 flex items-center gap-2 border-t border-line pt-4">
                <Input
                  placeholder="Write a message about power, water, or inspection times..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <Button type="submit" variant="primary" size="md">
                  Send
                </Button>
              </form>
            </SectionCard>
          ) : null}
        </div>
      </div>
    </PageContainer>
  )
}

