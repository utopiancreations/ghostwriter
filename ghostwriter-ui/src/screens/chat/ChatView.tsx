import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, Send, Bot, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatView({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetch(`/mock-data/${projectId}/00_chat.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Message[]) => setMessages(data))
      .catch(() => setMessages([]))
  }, [projectId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    setMessages((m) => [...m, { role: 'user', content: input.trim() }])
    setInput('')
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 rounded-md border border-border/60 bg-background/40">
        <div className="mx-auto w-full max-w-3xl space-y-4 p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`inline-block max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  m.role === 'user' ? 'bg-primary/20 text-foreground rounded-br-sm' : 'bg-card/70 text-foreground rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/40 text-foreground/70">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 mt-3 bg-background/60 backdrop-blur">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-[auto_1fr_auto] items-end gap-2 rounded-md border border-border/60 bg-card/60 p-2 shadow-sm">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 hover:bg-secondary/40">
            <Paperclip size={16} />
          </button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message (mock only)"
            className="h-12 resize-none border-0 bg-transparent focus-visible:ring-0"
          />
          <Button onClick={send} className="h-10 px-4">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
