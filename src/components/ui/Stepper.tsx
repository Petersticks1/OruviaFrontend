import { Icon } from './Icon'
import { cn } from '@/lib/cn'

export interface StepItem {
  id: string
  label: string
  description?: string
}

export interface StepperProps {
  steps: readonly StepItem[]
  currentStep: number
  onStepClick?: (index: number) => void
  className?: string
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                disabled={!onStepClick}
                onClick={() => onStepClick?.(index)}
                className={cn(
                  'flex items-center gap-2.5 text-left transition-colors',
                  onStepClick ? 'cursor-pointer' : 'cursor-default',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                    isCompleted
                      ? 'bg-ink-900 text-surface'
                      : isCurrent
                        ? 'bg-brand-500 text-surface ring-4 ring-brand-50'
                        : 'border border-line bg-surface text-ink-500',
                  )}
                >
                  {isCompleted ? <Icon name="check" size={16} /> : index + 1}
                </span>
                <span className="hidden sm:block">
                  <span
                    className={cn(
                      'block text-xs font-semibold',
                      isCurrent || isCompleted ? 'text-ink-900' : 'text-ink-500',
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description ? (
                    <span className="block text-xs text-ink-500">{step.description}</span>
                  ) : null}
                </span>
              </button>
              {index < steps.length - 1 ? (
                <div
                  className={cn(
                    'h-0.5 flex-1 rounded-full transition-colors',
                    isCompleted ? 'bg-ink-900' : 'bg-line',
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

