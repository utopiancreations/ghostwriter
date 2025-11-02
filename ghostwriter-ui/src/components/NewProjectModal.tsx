import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useProjects } from '@/context/ProjectContext'
import { MessageSquare, Upload } from 'lucide-react'

export function NewProjectModal({ open, onOpenChange }: { open: boolean; onOpenChange: (val: boolean) => void }) {
  const { addProject, setActiveProject } = useProjects()
  const [name, setName] = useState('')
  const [mode, setMode] = useState<'scratch' | 'upload'>('scratch')

  const create = () => {
    if (!name.trim()) return
    const project = addProject({ name: name.trim(), hasRawText: mode === 'upload' })
    setActiveProject(project.id)
    onOpenChange(false)
    setName('')
    setMode('scratch')
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
              className={`cursor-pointer transition-all ${mode === 'scratch' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setMode('scratch')}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary" />
                  <CardTitle>Start from scratch</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">Begin with a blank chat</p>
              </CardContent>
            </Card>
            <Card
              className={`cursor-pointer transition-all ${mode === 'upload' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setMode('upload')}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Upload size={16} className="text-primary" />
                  <CardTitle>Upload existing text</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">Paste or upload a document</p>
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
