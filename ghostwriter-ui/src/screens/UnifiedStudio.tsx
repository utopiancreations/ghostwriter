import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageSquare, List, FileText, PanelRight } from 'lucide-react'
import { ChatTab } from './tabs/ChatTab'
import { OutlineTab } from './tabs/OutlineTab'
import { DraftTab } from './tabs/DraftTab'
import { ContextPanel } from '@/components/ContextPanel'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { useState } from 'react'

export function UnifiedStudio({ projectId }: { projectId: string }) {
  const [activeTab, setActiveTab] = useState<'chat' | 'outline' | 'draft'>('chat')
  const [draftScrollTarget, setDraftScrollTarget] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string | undefined>(undefined)
  const [showContext, setShowContext] = useState(false)

  const handleOutlineClick = (heading: string) => {
    setActiveTab('draft')
    setDraftScrollTarget(heading)
    setActiveSection(heading)
    setShowContext(true)
  }

  const handleToggleContext = () => {
    setShowContext(!showContext)
  }

  return (
    <div className="flex h-full animate-in fade-in-0">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={showContext ? 70 : 100} minSize={50}>
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="h-full flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b border-border/60 bg-transparent p-0">
                <TabsTrigger value="chat" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <MessageSquare size={16} />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="outline" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <List size={16} />
                  Outline
                </TabsTrigger>
                <TabsTrigger value="draft" className="gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <FileText size={16} />
                  Draft
                </TabsTrigger>
                <button 
                  onClick={handleToggleContext}
                  className={`ml-auto inline-flex h-9 items-center gap-1 rounded-none border-l border-border/60 px-3 text-xs hover:bg-secondary/40 transition-colors ${
                    showContext ? 'text-foreground bg-secondary/30' : 'text-foreground/70'
                  }`}
                >
                  <PanelRight size={14} />
                  Context
                </button>
              </TabsList>
              <div className="flex-1 overflow-hidden">
                <TabsContent value="chat" className="h-full m-0 p-8">
                  <ChatTab projectId={projectId} />
                </TabsContent>
                <TabsContent value="outline" className="h-full m-0 p-8">
                  <OutlineTab projectId={projectId} onHeadingClick={handleOutlineClick} />
                </TabsContent>
                <TabsContent value="draft" className="h-full m-0 p-8">
                  <DraftTab projectId={projectId} scrollTarget={draftScrollTarget} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </ResizablePanel>

        {showContext && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
              <ContextPanel projectId={projectId} activeSection={activeSection} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
}
