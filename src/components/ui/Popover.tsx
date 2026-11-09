import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

export interface PopoverProps {
  trigger: (props: {
    open: boolean
    toggle: () => void
    setTriggerEl: (el: HTMLButtonElement | null) => void
  }) => ReactNode
  children: (props: { close: () => void }) => ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function Popover({ trigger, children, align = 'right', className }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerElRef = useRef<HTMLButtonElement | null>(null)

  const setTriggerEl = useCallback((el: HTMLButtonElement | null) => {
    triggerElRef.current = el
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    triggerElRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [open, close])

  return (
    <div ref={containerRef} className="relative inline-block">
      {trigger({
        open,
        toggle: () => setOpen((prev) => !prev),
        setTriggerEl,
      })}
      {open ? (
        <div
          role="menu"
          className={cn(
            'absolute top-[calc(100%+0.5rem)] z-50 min-w-60 rounded-[var(--radius-md)] border border-line bg-surface p-2 shadow-[var(--shadow-hover)]',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children({ close })}
        </div>
      ) : null}
    </div>
  )
}
