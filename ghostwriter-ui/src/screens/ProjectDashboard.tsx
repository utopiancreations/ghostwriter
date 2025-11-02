import { useProjects } from '@/context/ProjectContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProjectDashboard() {
  const { projects } = useProjects()
  return (
    <div className="mx-auto w-full max-w-3xl animate-in fade-in-0">
      <h1 className="mb-4 text-lg font-semibold">Your Projects</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70">{p.hasRawText ? 'Started with uploaded text' : 'Started from scratch'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
