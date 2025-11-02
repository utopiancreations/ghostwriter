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
      <ScrollArea className="flex-1 rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-3xl space-y-8 p-8">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-sm">
                  <Bot size={18} />
                </div>
              )}
              {m.role === 'system' && (
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/10 text-purple-400 shadow-sm">
                  <Sparkles size={18} />
                </div>
              )}
              <div
                className={`inline-block max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-md ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-br from-primary/30 to-primary/20 text-foreground rounded-br-md backdrop-blur-sm' 
                    : m.role === 'system'
                    ? 'bg-gradient-to-br from-secondary/30 to-secondary/20 text-foreground/80 italic rounded-bl-md backdrop-blur-sm'
                    : 'bg-card/80 text-foreground rounded-bl-md backdrop-blur-sm border border-border/20'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 text-blue-400 shadow-sm">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>
      <div className="mt-5">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-[auto_1fr_auto] items-end gap-3 rounded-2xl border border-border/40 bg-card/70 backdrop-blur-sm p-4 shadow-lg">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground/60 hover:bg-secondary/40 hover:text-foreground transition-colors">
            <Paperclip size={18} />
          </button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or use /generate_outline, /interview..."
            className="min-h-[2.5rem] max-h-32 resize-none border-0 bg-transparent focus-visible:ring-0 text-[15px]"
          />
          <Button onClick={send} className="h-10 px-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Send size={16} />
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-foreground/40">
          Try: <code className="rounded-md bg-secondary/30 px-2 py-0.5">/generate_outline</code> or <code className="rounded-md bg-secondary/30 px-2 py-0.5">/interview_scene</code>
        </p>
      </div>
    </div>
  )
}
