import { useId } from 'react'
import { cn } from '@/lib/cn'

export interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatLabel?: (val: number) => string
  label?: string
  className?: string
}

export function RangeSlider({
  min,
  max,
  step = 100_000,
  value,
  onChange,
  formatLabel = (v) => String(v),
  label = 'Price range',
  className,
}: RangeSliderProps) {
  const minInputId = useId()
  const maxInputId = useId()
  const [minVal, maxVal] = value

  const handleMinChange = (raw: number) => {
    const clamped = Math.min(raw, maxVal - step)
    onChange([Math.max(min, clamped), maxVal])
  }

  const handleMaxChange = (raw: number) => {
    const clamped = Math.max(raw, minVal + step)
    onChange([minVal, Math.min(max, clamped)])
  }

  const minStyle: React.CSSProperties = {
    ['--attr-min' as string]: String(min),
    ['--attr-max' as string]: String(max),
    ['--control-value' as string]: String(minVal),
  }

  const maxStyle: React.CSSProperties = {
    ['--attr-min' as string]: String(min),
    ['--attr-max' as string]: String(max),
    ['--control-value' as string]: String(maxVal),
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-ink-700">
        <span>{label}</span>
        <span className="text-ink-900">
          {formatLabel(minVal)} – {formatLabel(maxVal)}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
        <div>
          <label htmlFor={minInputId} className="mb-1 block text-xs text-ink-500">
            Minimum ({formatLabel(minVal)})
          </label>
          <input
            id={minInputId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={minVal}
            aria-valuetext={formatLabel(minVal)}
            style={minStyle}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="oruvia-range"
          />
        </div>
        <div>
          <label htmlFor={maxInputId} className="mb-1 block text-xs text-ink-500">
            Maximum ({formatLabel(maxVal)})
          </label>
          <input
            id={maxInputId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxVal}
            aria-valuetext={formatLabel(maxVal)}
            style={maxStyle}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="oruvia-range"
          />
        </div>
      </div>
    </div>
  )
}

