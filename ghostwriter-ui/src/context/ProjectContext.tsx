import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface Project {
  id: string
  name: string
  hasRawText: boolean // true if started with uploaded text
}

interface ProjectContextValue {
  projects: Project[]
  activeProjectId: string | null
  activeProject: Project | null
  setActiveProject: (id: string | null) => void
  addProject: (p: Omit<Project, 'id'> & { id?: string }) => Project
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined)

const LOCAL_KEY = 'ghostwriter.projects'
const ACTIVE_KEY = 'ghostwriter.activeProjectId'

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

  // Load initial data from localStorage or mock-data
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY)
    const storedActive = localStorage.getItem(ACTIVE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Project[]
        setProjects(parsed)
      } catch {}
    } else {
      // fetch mock projects on first load
      fetch('/mock-data/projects.json')
        .then((r) => r.json())
        .then((data: Project[]) => setProjects(data))
        .catch(() => setProjects([]))
    }
    if (storedActive) setActiveProjectId(storedActive)
  }, [])

  // persist changes
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    if (activeProjectId) localStorage.setItem(ACTIVE_KEY, activeProjectId)
    else localStorage.removeItem(ACTIVE_KEY)
  }, [activeProjectId])

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? null,
    [projects, activeProjectId]
  )

  const setActiveProject = (id: string | null) => setActiveProjectId(id)

  const addProject: ProjectContextValue['addProject'] = (p) => {
    const id = p.id ?? slugify(p.name || 'project')
    const project: Project = { id, name: p.name, hasRawText: p.hasRawText ?? false }
    setProjects((prev) => [...prev, project])
    return project
  }

  const value: ProjectContextValue = {
    projects,
    activeProjectId,
    activeProject,
    setActiveProject,
    addProject,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProjects() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider')
  return ctx
}
