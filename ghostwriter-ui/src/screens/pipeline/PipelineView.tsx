import { useEffect, useState } from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import ReactMarkdown from 'react-markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

interface InterviewQA {
  question: string
  answer: string
  section?: string
}

export function PipelineView({ projectId }: { projectId: string }) {
  const [outline, setOutline] = useState<string>('')
  const [interview, setInterview] = useState<InterviewQA[]>([])
  const [draft, setDraft] = useState<string>('')

  useEffect(() => {
    fetch(`/mock-data/${projectId}/01_outline.md`).then(async (r) => setOutline(r.ok ? await r.text() : ''))
    fetch(`/mock-data/${projectId}/02_interview_data.json`).then(async (r) =>
      setInterview(r.ok ? await r.json() : [])
    )
    fetch(`/mock-data/${projectId}/03_draft.md`).then(async (r) => setDraft(r.ok ? await r.text() : ''))
  }, [projectId])

  return (
  <ResizablePanelGroup direction="horizontal" className="h-full animate-in fade-in-0">
      {/* Outline */}
      <ResizablePanel defaultSize={25} minSize={18} className="border-r border-border/60">
        <ScrollArea className="h-full bg-background/40">
          <div className="max-w-none p-4 text-sm leading-6 text-foreground markdown">
            <ReactMarkdown>{outline}</ReactMarkdown>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />

      {/* Context & Tools */}
      <ResizablePanel defaultSize={30} minSize={22} className="border-r border-border/60">
        <div className="h-full p-3">
          <Tabs defaultValue="interview">
            <TabsList>
              <TabsTrigger value="interview">Interview</TabsTrigger>
              <TabsTrigger value="cowriter">Co-Writer</TabsTrigger>
            </TabsList>
            <TabsContent value="interview">
              <ScrollArea className="h-[calc(100vh-12rem)] bg-background/40">
                <div className="space-y-4 p-2">
                  {interview.map((qa, i) => (
                    <div key={i} className="rounded-md border border-border/60 bg-card/60 p-3 shadow-sm">
                      <p className="mb-1 text-xs uppercase tracking-wide text-foreground/60">{qa.section ?? 'Section'}</p>
                      <p className="font-medium text-foreground">Q: {qa.question}</p>
                      <p className="text-foreground/80">A: {qa.answer}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="cowriter">
              <div className="mt-3 text-sm text-foreground/70">Mock only. No AI calls will be made.</div>
            </TabsContent>
          </Tabs>
        </div>
      </ResizablePanel>
      <ResizableHandle />

      {/* Draft Editor */}
      <ResizablePanel defaultSize={45} minSize={30}>
        <div className="h-full p-3">
          <Textarea className="h-[calc(100vh-8rem)] w-full" value={draft} onChange={(e) => setDraft(e.target.value)} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
