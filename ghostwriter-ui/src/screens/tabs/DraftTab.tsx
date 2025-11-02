import { useEffect, useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

export function DraftTab({ projectId, scrollTarget }: { projectId: string; scrollTarget: string | null }) {
  const [draft, setDraft] = useState<string>('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    fetch(`/mock-data/${projectId}/03_draft.md`)
      .then((r) => (r.ok ? r.text() : ''))
      .then((text) => setDraft(text))
      .catch(() => setDraft(''))
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

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-foreground/70">Full draft editor • Auto-saves on change</span>
        <Button onClick={save} variant="outline" className="h-8 gap-2 text-xs">
          <Save size={14} />
          Save
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        className="h-[calc(100%-3rem)] w-full resize-none font-mono text-sm leading-6"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Your draft will appear here..."
      />
    </div>
  )
}
