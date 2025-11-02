import { useProjects } from '@/context/ProjectContext'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'

export function ProjectSidebar({ onOpenNew }: { onOpenNew: () => void }) {
  const { projects, activeProjectId, setActiveProject } = useProjects()
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    if (!query.trim()) return projects
    const q = query.toLowerCase()
    return projects.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
  }, [projects, query])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <h2 className="text-sm font-semibold">Projects</h2>
        <Button className="h-7 px-2 py-1 text-xs" onClick={onOpenNew}>
          New
        </Button>
      </div>
      <div className="p-4">
        <Input placeholder="Search projects" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProject(p.id)}
              className={cn(
                'group w-full rounded-md px-3 py-2 text-left text-sm text-foreground/80 hover:bg-secondary/40 transition-colors flex items-center justify-between',
                activeProjectId === p.id && 'bg-secondary/50 text-foreground'
              )}
            >
              <span className="truncate">{p.name}</span>
              <span className="text-[10px] uppercase text-foreground/50">{p.hasRawText ? 'TXT' : 'NEW'}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
