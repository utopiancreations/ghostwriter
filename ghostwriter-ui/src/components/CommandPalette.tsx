import * as React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useProjects } from '@/context/ProjectContext'
import { Command } from 'cmdk'
import { Command as CommandIcon, Plus, Home, PanelLeft } from 'lucide-react'

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewProject: () => void
}

export function CommandPalette({ open, onOpenChange, onNewProject }: CommandPaletteProps) {
  const { projects, activeProjectId, setActiveProject } = useProjects()
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  const close = () => onOpenChange(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden border border-border/60 bg-background/80 backdrop-blur-md w-[90vw] max-w-xl animate-in fade-in-0 zoom-in-95">
        <Command label="Command Menu" loop>
          <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
            <CommandIcon size={14} className="text-foreground/60" />
            <Command.Input ref={inputRef as any} placeholder="Type a command or search projects…" className="h-8 flex-1 bg-transparent text-sm outline-none" />
            <kbd className="rounded bg-secondary/40 px-2 py-0.5 text-[10px] text-foreground/60">⌘K</kbd>
          </div>
          <Command.List className="max-h-[50vh] overflow-auto p-2">
            <Command.Empty className="px-2 py-3 text-sm text-foreground/60">No results found.</Command.Empty>

            <Command.Group heading="Navigation" className="px-1">
              <Command.Item
                value="open dashboard"
                onSelect={() => {
                  setActiveProject(null)
                  close()
                }}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-secondary/40"
              >
                <Home size={14} />
                Open Dashboard
              </Command.Item>
              {activeProjectId && (
                <Command.Item
                  value="open studio"
                  onSelect={() => close()}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-secondary/40"
                >
                  <PanelLeft size={14} />
                  Open Studio
                </Command.Item>
              )}
            </Command.Group>

            <Command.Separator className="my-2 border-t border-border/60" />

            <Command.Group heading="Projects" className="px-1">
              <Command.Item
                value="new project"
                onSelect={() => {
                  onNewProject()
                  close()
                }}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-secondary/40"
              >
                <Plus size={14} />
                New Project…
              </Command.Item>
              {projects.map((p) => (
                <Command.Item
                  key={p.id}
                  value={`switch ${p.name}`}
                  onSelect={() => {
                    setActiveProject(p.id)
                    close()
                  }}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-secondary/40"
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] uppercase text-foreground/50">{p.type}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
