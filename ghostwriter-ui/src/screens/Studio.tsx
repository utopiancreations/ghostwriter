import { useProjects } from '@/context/ProjectContext'
import { UnifiedStudio } from './UnifiedStudio'

export function Studio() {
  const { activeProject } = useProjects()
  if (!activeProject) return null
  return <UnifiedStudio projectId={activeProject.id} />
}
