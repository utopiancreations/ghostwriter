import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[120px] w-full rounded-xl border border-border/50 bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50 transition-all',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'
