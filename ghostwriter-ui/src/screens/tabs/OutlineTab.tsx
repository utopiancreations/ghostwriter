import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import ReactMarkdown from 'react-markdown'
import { ChevronRight, FileWarning } from 'lucide-react'

export function OutlineTab({ projectId, onHeadingClick }: { projectId: string; onHeadingClick: (heading: string) => void }) {
  const [outline, setOutline] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`/mock-data/${projectId}/01_outline.md`)
      .then((r) => {
        if (!r.ok) {
          throw new Error('File not found')
        }
        return r.text()
      })
      .then((text) => setOutline(text))
      .catch(() => {
        setOutline('')
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [projectId])

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName.match(/^H[1-6]$/)) {
      const heading = target.textContent || ''
      onHeadingClick(heading)
    }
  }

  const renderContent = () => {
    if (loading) {
      return <div className="p-6 text-foreground/60">Loading outline...</div>
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-foreground/60">
          <FileWarning size={24} className="mb-2" />
          <p>No outline generated yet.</p>
          <p className="text-xs">
            Try using the <code className="rounded bg-secondary/40 px-1">/generate_outline</code> command in the Chat tab.
          </p>
        </div>
      )
    }
    return (
      <div 
        className="mx-auto w-full max-w-3xl p-6 markdown"
        onClick={handleClick}
      >
        <div className="mb-4 flex items-center gap-2 text-sm text-foreground/60">
          <span>Click any heading to jump to it in the Draft</span>
          <ChevronRight size={14} />
        </div>
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="group cursor-pointer hover:text-primary transition-colors" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="group cursor-pointer hover:text-primary transition-colors" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="group cursor-pointer hover:text-primary transition-colors" {...props} />
            ),
          }}
        >
          {outline}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full rounded-md border border-border/60 bg-background/40">
      {renderContent()}
    </ScrollArea>
  )
}
