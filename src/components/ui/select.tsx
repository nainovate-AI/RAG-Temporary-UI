// src/components/ui/select.tsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Check } from "lucide-react"

// ============ Your existing Select component ============
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ value: string; label: string }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, ...props }, ref) => {
    const id = props.id || props.name

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            id={id}
            {...props}
          >
            <option value="">Select an option...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

// ============ Additional Select components for compound pattern ============
interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

interface CompoundSelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

// Rename to avoid conflict with existing Select
export function CompoundSelect({ value, defaultValue, onValueChange, children }: CompoundSelectProps) {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || '')
  const [open, setOpen] = React.useState(false)

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  return (
    <SelectContext.Provider
      value={{
        value: selectedValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
      }}
    >
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function SelectTrigger({ children, className, ...props }: SelectTriggerProps) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectTrigger must be used within CompoundSelect')

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectValue must be used within CompoundSelect')

  const selectedItem = React.useMemo(() => {
    const items = document.querySelectorAll('[data-select-item]')
    for (const item of items) {
      if (item.getAttribute('data-value') === context.value) {
        return item.textContent
      }
    }
    return null
  }, [context.value])

  return <span>{selectedItem || placeholder || 'Select...'}</span>
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SelectContent({ children, className, ...props }: SelectContentProps) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectContent must be used within CompoundSelect')

  if (!context.open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={cn(
          'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80',
          'absolute top-full left-0 mt-1 w-full',
          className
        )}
        {...props}
      >
        <div className="p-1">
          {children}
        </div>
      </div>
    </>
  )
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
}

export function SelectItem({ value, children, className, ...props }: SelectItemProps) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectItem must be used within CompoundSelect')

  const isSelected = context.value === value

  return (
    <div
      data-select-item
      data-value={value}
      onClick={() => context.onValueChange(value)}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        isSelected && 'bg-accent text-accent-foreground',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
}

export { Select }