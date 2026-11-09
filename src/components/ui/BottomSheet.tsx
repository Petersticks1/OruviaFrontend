import { type ReactNode, useEffect, useId, useRef } from 'react'
import { IconButton } from './IconButton'
import { cn } from '@/lib/cn'

export interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  fullScreen?: boolean
  className?: string
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  fullScreen = false,
  className,
}: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pressedOutsideRef = useRef(false)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal()
      } else {
        dialog.setAttribute('open', '')
      }
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') {
        dialog.close()
      } else {
        dialog.removeAttribute('open')
      }
    }
  }, [open])

  const isPointerOutside = (e: React.PointerEvent<HTMLDialogElement>): boolean => {
    const dialog = dialogRef.current
    if (!dialog) return false
    const rect = dialog.getBoundingClientRect()
    return (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    )
  }

  const closedByAttr: Record<string, string> = { closedby: 'any' }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onPointerDown={(e) => {
        pressedOutsideRef.current = isPointerOutside(e)
      }}
      onPointerUp={(e) => {
        if (pressedOutsideRef.current && isPointerOutside(e)) {
          onClose()
        }
      }}
      className={cn(
        'fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none border-t border-line bg-surface p-0 text-ink-900 shadow-[var(--shadow-sheet)] transition-transform duration-200 open:flex open:flex-col',
        fullScreen ? 'h-[95dvh] rounded-t-[var(--radius-lg)]' : 'max-h-[85dvh] rounded-t-[var(--radius-lg)]',
        className,
      )}
      {...closedByAttr}
    >
      <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-line" aria-hidden="true" />
      <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <h2 id={titleId} className="text-base font-semibold text-ink-900">
          {title}
        </h2>
        <IconButton
          icon="close"
          variant="ghost"
          size="sm"
          aria-label="Close sheet"
          onClick={onClose}
        />
      </header>
      <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      {footer ? (
        <footer className="flex items-center justify-between gap-3 border-t border-line bg-surface px-5 py-3.5">
          {footer}
        </footer>
      ) : null}
    </dialog>
  )
}

