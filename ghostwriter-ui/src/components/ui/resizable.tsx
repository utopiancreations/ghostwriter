import * as React from 'react'
import {
  PanelGroup as ResizablePanelGroupPrimitive,
  Panel as ResizablePanelPrimitive,
  PanelResizeHandle,
} from 'react-resizable-panels'
import { cn } from '@/lib/utils'

export const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePanelGroupPrimitive>) => (
  <ResizablePanelGroupPrimitive className={cn('h-full', className)} {...props} />
)

export const ResizablePanel = ResizablePanelPrimitive

export function ResizableHandle({ className, ...props }: React.ComponentProps<typeof PanelResizeHandle>) {
  return (
    <PanelResizeHandle
      className={cn(
        'group relative flex w-px items-center justify-center bg-transparent after:absolute after:inset-y-0 after:left-1/2 after:w-[3px] after:-translate-x-1/2 after:rounded-full after:bg-border after:opacity-0 after:transition-opacity hover:after:opacity-100',
        className
      )}
      {...props}
    />
  )
}
