import { useState } from 'react'
import { PenLine, Command as CommandIcon, Plus } from 'lucide-react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { ProjectSidebar } from '@/components/ProjectSidebar'
import { NewProjectModal } from '@/components/NewProjectModal'
import { useProjects } from '@/context/ProjectContext'
import { ProjectDashboard } from '@/screens/ProjectDashboard'
import { Studio } from '@/screens/Studio'
import { CommandPalette } from '@/components/CommandPalette'

export function AppShell() {
  const { activeProject } = useProjects()
  const [open, setOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="h-screen">
        <ResizablePanel defaultSize={20} minSize={14} maxSize={40} className="border-r border-border/60 bg-background/60 supports-backdrop-filter:bg-background/40 backdrop-blur">
          <ProjectSidebar onOpenNew={() => setOpen(true)} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80} className="bg-background/60 supports-backdrop-filter:bg-background/40 backdrop-blur">
          <div className="h-full">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-background/70 px-6 py-4 backdrop-blur animate-in fade-in-0 slide-in-from-top-1">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
                  <PenLine className="text-primary" size={16} />
                </div>
                <span className="text-sm font-medium tracking-tight">Ghostwriter</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground/60">{activeProject ? 'Studio' : 'Dashboard'}{activeProject ? ` • ${activeProject.name}` : ''}</span>
                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-border/60 bg-card/60 px-2 text-xs hover:bg-secondary/40"
                >
                  <Plus size={14} /> New
                </button>
                <button
                  onClick={() => setCmdOpen(true)}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-border/60 bg-card/60 px-2 text-xs hover:bg-secondary/40"
                >
                  <CommandIcon size={14} />
                  <span>Command</span>
                  <kbd className="ml-1 rounded bg-secondary/40 px-1.5 py-0.5 text-[10px] text-foreground/60">⌘K</kbd>
                </button>
              </div>
            </div>
            <div className="h-[calc(100%-57px)] p-6">
              {activeProject ? <Studio /> : <ProjectDashboard />}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <NewProjectModal open={open} onOpenChange={setOpen} />
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} onNewProject={() => setOpen(true)} />
    </>
  )
}
