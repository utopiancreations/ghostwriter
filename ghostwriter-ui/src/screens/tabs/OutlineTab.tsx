import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import ReactMarkdown from 'react-markdown'
import { ChevronRight } from 'lucide-react'

export function OutlineTab({ projectId, onHeadingClick }: { projectId: string; onHeadingClick: (heading: string) => void }) {
  const [outline, setOutline] = useState<string>('')

  useEffect(() => {
    fetch(`/mock-data/${projectId}/01_outline.md`)
      .then((r) => (r.ok ? r.text() : ''))
      .then((text) => setOutline(text))
      .catch(() => setOutline(''))
  }, [projectId])

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName.match(/^H[1-6]$/)) {
      const heading = target.textContent || ''
      onHeadingClick(heading)
    }
  }

  return (
    <ScrollArea className="h-full rounded-md border border-border/60 bg-background/40">
      <div 
        className="mx-auto w-full max-w-3xl p-6 markdown"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
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
    </ScrollArea>
  )
}
