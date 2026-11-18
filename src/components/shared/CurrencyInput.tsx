import type { InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/Input'

export interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: number
  onValueChange: (value: number) => void
  hasError?: boolean
}

export function formatWithCommas(value: number | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) return ''
  return value.toLocaleString('en-US')
}

export function CurrencyInput({
  value,
  onValueChange,
  hasError,
  placeholder = '0',
  ...props
}: CurrencyInputProps) {
  const displayValue = formatWithCommas(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/[^\d]/g, '')
    if (!rawDigits) {
      onValueChange(0)
      return
    }
    const numericValue = Number.parseInt(rawDigits, 10)
    onValueChange(Number.isNaN(numericValue) ? 0 : numericValue)
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      hasError={hasError}
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      {...props}
    />
  )
}
