import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'outline' | 'ghost'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  default:
    'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm',
  outline:
    'border border-border text-foreground hover:bg-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'text-foreground hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
