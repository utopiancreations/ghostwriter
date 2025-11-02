import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useProjects } from '@/context/ProjectContext'
import type { ProjectType } from '@/context/ProjectContext'

export function NewProjectModal({ open, onOpenChange }: { open: boolean; onOpenChange: (val: boolean) => void }) {
  const { addProject, setActiveProject } = useProjects()
  const [name, setName] = useState('')
  const [type, setType] = useState<ProjectType>('chat')

  const create = () => {
    if (!name.trim()) return
    const project = addProject({ name: name.trim(), type })
    setActiveProject(project.id)
    onOpenChange(false)
    setName('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Card
              className={`cursor-pointer ${type === 'chat' ? 'ring-2 ring-zinc-600' : ''}`}
              onClick={() => setType('chat')}
            >
              <CardHeader>
                <CardTitle>Start from scratch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">Chat workflow</p>
              </CardContent>
            </Card>
            <Card
              className={`cursor-pointer ${type === 'pipeline' ? 'ring-2 ring-zinc-600' : ''}`}
              onClick={() => setType('pipeline')}
            >
              <CardHeader>
                <CardTitle>Start from existing material</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">Outline / Interview / Draft</p>
              </CardContent>
            </Card>
          </div>
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
