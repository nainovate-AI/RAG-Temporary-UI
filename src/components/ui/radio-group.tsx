// src/components/ui/radio-group.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupContextValue {
  value: string
  onValueChange: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined)

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  ...props
}: RadioGroupProps) {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || '')

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
  }

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  return (
    <RadioGroupContext.Provider
      value={{
        value: selectedValue,
        onValueChange: handleValueChange,
      }}
    >
      <div
        role="radiogroup"
        className={cn('grid gap-2', className)}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

interface RadioGroupItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  id?: string
}

export function RadioGroupItem({
  value,
  id,
  className,
  ...props
}: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext)
  if (!context) throw new Error('RadioGroupItem must be used within RadioGroup')

  const isSelected = context.value === value

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      data-state={isSelected ? 'checked' : 'unchecked'}
      value={value}
      id={id}
      onClick={() => context.onValueChange(value)}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <span className="flex items-center justify-center">
        {isSelected && (
          <span className="h-2.5 w-2.5 rounded-full bg-current" />
        )}
      </span>
    </button>
  )
}