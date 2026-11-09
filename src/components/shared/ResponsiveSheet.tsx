import { type ReactNode, useEffect, useState } from 'react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Modal } from '@/components/ui/Modal'

export interface ResponsiveSheetProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function ResponsiveSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ResponsiveSheetProps) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  )

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  if (isMobile) {
    return (
      <BottomSheet open={open} onClose={onClose} title={title} footer={footer}>
        {children}
      </BottomSheet>
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={footer}
      size={size}
    >
      {children}
    </Modal>
  )
}
