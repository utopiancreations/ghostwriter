import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useProjects } from '@/context/ProjectContext'

export function NewProjectModal({ open, onOpenChange }: { open: boolean; onOpenChange: (val: boolean) => void }) {
  const { addProject, setActiveProject } = useProjects()
  const [name, setName] = useState('')

  const create = () => {
    if (!name.trim()) return
    // All new projects are chat-first, starting from scratch
    const project = addProject({ name: name.trim(), hasRawText: false })
    setActiveProject(project.id)
    onOpenChange(false)
    setName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      create()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            This will create a new chat session and project folder.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Project name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={create} disabled={!name.trim()}>
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
