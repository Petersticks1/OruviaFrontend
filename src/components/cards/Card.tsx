import { cva, type VariantProps } from 'class-variance-authority'
import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

const cardVariants = cva(
  'oruvia-card rounded-[var(--radius-md)] bg-surface text-ink-900 transition-all duration-200 overflow-hidden',
  {
    variants: {
      variant: {
        elevated: 'border border-line/70 shadow-[var(--shadow-card)]',
        outlined: 'border border-line',
        flat: 'bg-surface-muted border border-transparent',
        interactive:
          'border border-line/80 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)] cursor-pointer',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3.5',
        md: 'p-5',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'outlined',
      padding: 'md',
    },
  },
)

export type CardElement = 'article' | 'div' | 'a' | 'button'

export interface CardProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof cardVariants> {
  as?: CardElement
  href?: string
  children: ReactNode
}

function CardRoot({
  as = 'article',
  variant,
  padding,
  className,
  children,
  ...props
}: CardProps) {
  const Component = as as ElementType
  return (
    <Component className={cn(cardVariants({ variant, padding }), className)} {...props}>
      {children}
    </Component>
  )
}

export interface CardSlotProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function CardMedia({ className, children, ...props }: CardSlotProps) {
  return (
    <div className={cn('relative overflow-hidden bg-surface-muted', className)} {...props}>
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: CardSlotProps) {
  return (
    <header className={cn('flex items-start justify-between gap-3', className)} {...props}>
      {children}
    </header>
  )
}

function CardBody({ className, children, ...props }: CardSlotProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: CardSlotProps) {
  return (
    <footer
      className={cn('flex items-center justify-between gap-3 pt-3', className)}
      {...props}
    >
      {children}
    </footer>
  )
}

export const Card = Object.assign(CardRoot, {
  Media: CardMedia,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})

