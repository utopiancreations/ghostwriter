import { AppShell } from '@/layouts/AppShell'
import { ProjectProvider } from '@/context/ProjectContext'
import './App.css'

export default function App() {
  return (
    <ProjectProvider>
      <AppShell />
    </ProjectProvider>
  )
}
