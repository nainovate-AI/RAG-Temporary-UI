import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500/10 text-green-500 hover:bg-green-500/20",
        warning:
          "border-transparent bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
        error:
          "border-transparent bg-red-500/10 text-red-500 hover:bg-red-500/20",
        info:
          "border-transparent bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {children}
    </div>
  )
}

// Status-specific badge components
function StatusBadge({ status, ...props }: { status: string } & Omit<BadgeProps, 'variant'>) {
  const statusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'secondary', label: 'Inactive' },
    processing: { variant: 'warning', label: 'Processing' },
    error: { variant: 'error', label: 'Error' },
    indexed: { variant: 'success', label: 'Indexed' },
    pending: { variant: 'warning', label: 'Pending' },
  }

  const config = statusConfig[status] || { variant: 'default', label: status }

  return (
    <Badge variant={config.variant} dot {...props}>
      {config.label}
    </Badge>
  )
}

export { Badge, StatusBadge, badgeVariants }


