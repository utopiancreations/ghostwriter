import { useProjects } from '@/context/ProjectContext'
import { ChatView } from './chat/ChatView'
import { PipelineView } from './pipeline/PipelineView'

export function Studio() {
  const { activeProject } = useProjects()
  if (!activeProject) return null
  if (activeProject.type === 'chat') return <ChatView projectId={activeProject.id} />
  return <PipelineView projectId={activeProject.id} />
}
