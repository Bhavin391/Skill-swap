'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Send } from 'lucide-react'

interface Message {
  _id: string
  sender_id: string
  text: string
  timestamp: string
}

interface ChatData {
  other_user: {
    name: string
    email: string
    skills_offering: string[]
    skills_learning: string[]
  }
  messages: Message[]
}

export default function ChatDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [messageText, setMessageText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [userId, setUserId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChat()
    const interval = setInterval(loadChat, 2000)
    return () => clearInterval(interval)
  }, [params.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatData?.messages])

  const loadChat = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`http://localhost:5000/api/chats/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setChatData(data)
        if (!userId && data.current_user_id) {
          setUserId(data.current_user_id)
        }
        setIsLoading(false)
      }
    } catch (err) {
      console.error('[v0] Error loading chat:', err)
    }
  }

  const sendMessage = async () => {
    if (!messageText.trim() || !userId) return

    setIsSending(true)
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          chat_id: params.id,
          text: messageText,
        }),
      })

      if (response.ok) {
        setMessageText('')
        await loadChat()
      }
    } catch (err) {
      console.error('[v0] Error sending message:', err)
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading || !chatData) {
    return (
      <main className="px-6 py-12 max-w-2xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">
      <Card className="bg-card border-border flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">
            {chatData.other_user.name}
          </h1>
          <p className="text-sm text-muted-foreground">{chatData.other_user.email}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatData.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center">
                No messages yet. Start a conversation!
              </p>
            </div>
          ) : (
            chatData.messages.map(msg => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender_id === userId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender_id === userId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={isSending}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isSending || !messageText.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* User Info */}
      <Card className="mt-8 p-6 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-4">About {chatData.other_user.name}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Can Teach
            </p>
            <div className="flex flex-wrap gap-2">
              {chatData.other_user.skills_offering.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Wants to Learn
            </p>
            <div className="flex flex-wrap gap-2">
              {chatData.other_user.skills_learning.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </main>
  )
}
