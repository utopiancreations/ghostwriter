import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export function ChatTab({ projectId }: { projectId: string }) {
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
    const text = input.trim()
    
    // Check for commands
    if (text.startsWith('/')) {
      const cmd = text.toLowerCase()
      if (cmd === '/generate_outline') {
        setMessages((m) => [
          ...m,
          { role: 'user', content: text },
          { role: 'system', content: '🔄 Generating outline from chat history...' },
          { role: 'assistant', content: 'I\'ve analyzed your conversation and generated a structured outline. You can view it in the Outline tab.' }
        ])
      } else if (cmd.startsWith('/interview')) {
        setMessages((m) => [
          ...m,
          { role: 'user', content: text },
          { role: 'system', content: '🔄 Starting interview session...' },
          { role: 'assistant', content: 'Let\'s dive deeper into this scene. What inspired this moment in your story?' }
        ])
      } else {
        setMessages((m) => [...m, { role: 'user', content: text }])
      }
    } else {
      setMessages((m) => [...m, { role: 'user', content: text }])
    }
    
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
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
              {m.role === 'system' && (
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/40 text-foreground/70">
                  <Sparkles size={16} />
                </div>
              )}
              <div
                className={`inline-block max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-primary/20 text-foreground rounded-br-sm' 
                    : m.role === 'system'
                    ? 'bg-secondary/20 text-foreground/80 italic rounded-bl-sm'
                    : 'bg-card/70 text-foreground rounded-bl-sm'
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
      <div className="mt-3">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-[auto_1fr_auto] items-end gap-2 rounded-md border border-border/60 bg-card/60 p-2 shadow-sm">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 hover:bg-secondary/40">
            <Paperclip size={16} />
          </button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or use /generate_outline, /interview..."
            className="h-12 resize-none border-0 bg-transparent focus-visible:ring-0"
          />
          <Button onClick={send} className="h-10 px-4">
            <Send size={16} />
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-foreground/50">
          Try: <code className="rounded bg-secondary/40 px-1">/generate_outline</code> or <code className="rounded bg-secondary/40 px-1">/interview_scene</code>
        </p>
      </div>
    </div>
  )
}
