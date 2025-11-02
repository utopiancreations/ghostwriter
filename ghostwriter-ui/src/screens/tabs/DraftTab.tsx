import { useEffect, useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Save, FileWarning } from 'lucide-react'

export function DraftTab({ projectId, scrollTarget }: { projectId: string; scrollTarget: string | null }) {
  const [draft, setDraft] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`/mock-data/${projectId}/03_draft.md`)
      .then((r) => {
        if (!r.ok) {
          throw new Error('File not found')
        }
        return r.text()
      })
      .then((text) => setDraft(text))
      .catch(() => {
        setDraft('')
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [projectId])

  useEffect(() => {
    if (scrollTarget && textareaRef.current) {
      // Find the heading in the text
      const lines = draft.split('\n')
      let targetLine = 0
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(scrollTarget)) {
          targetLine = i
          break
        }
      }
      
      // Scroll to approximate position
      if (targetLine > 0) {
        const element = textareaRef.current
        const lineHeight = 24 // approximate
        const scrollPos = targetLine * lineHeight
        element.scrollTop = scrollPos
        
        // Highlight the section briefly
        setTimeout(() => {
          const start = draft.indexOf(scrollTarget)
          if (start >= 0) {
            element.focus()
            element.setSelectionRange(start, start + scrollTarget.length)
          }
        }, 100)
      }
    }
  }, [scrollTarget, draft])

  const save = () => {
    // In a real app, this would save to the backend
    console.log('Saving draft:', draft.substring(0, 50) + '...')
  }

  const renderContent = () => {
    if (loading) {
      return <div className="p-4 text-sm text-foreground/60">Loading draft...</div>
    }
    if (error) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-6 text-foreground/60">
          <FileWarning size={24} className="mb-2" />
          <p>No draft generated yet.</p>
          <p className="text-xs">
            Try using the <code className="rounded bg-secondary/40 px-1">/write</code> command in the Chat tab.
          </p>
        </div>
      )
    }
    return (
      <Textarea
        ref={textareaRef}
        className="h-full w-full resize-none border-0 bg-transparent p-0 font-mono text-sm leading-6"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Your draft will appear here..."
      />
    )
  }

  return (
    <div className="flex h-full flex-col rounded-md border border-border/60 bg-background/40">
      <div className="flex items-center justify-between p-3 border-b border-border/60">
        <span className="text-sm text-foreground/70">Full draft editor</span>
        <Button onClick={save} variant="outline" className="h-8 gap-2 text-xs">
          <Save size={14} />
          Save
        </Button>
      </div>
      <div className="flex-1 p-4">
        {renderContent()}
      </div>
    </div>
  )
}
