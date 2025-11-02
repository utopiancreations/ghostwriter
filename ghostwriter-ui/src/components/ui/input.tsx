import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-xl border border-border/50 bg-background/80 px-4 py-2 text-sm text-foreground placeholder:text-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50 transition-all',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
