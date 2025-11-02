import { useProjects } from '@/context/ProjectContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProjectDashboard() {
  const { projects } = useProjects()
  return (
    <div className="mx-auto w-full max-w-3xl animate-in fade-in-0 px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold">Your Projects</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <Card key={p.id} className="rounded-2xl border-border/40 bg-background/60 backdrop-blur-sm hover:bg-background/80 hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/60">{p.hasRawText ? 'Started with uploaded text' : 'Started from scratch'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
