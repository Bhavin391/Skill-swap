'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

interface Conversation {
  _id: string
  user_id: string
  name: string
  email: string
  last_message?: string
  last_message_time?: string
  unread?: number
  unread_count?: number
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    setIsLoading(true)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch('http://localhost:5000/api/chats', {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        setConversations(data.chats || [])
      }
    } catch (err) {
      console.error('[v0] Error loading conversations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="px-6 py-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">
          {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
        </p>
      </div>

      {conversations.length === 0 ? (
        <Card className="p-12 text-center bg-card border-border">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-6">No messages yet.</p>
          <Link href="/matches">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Find Matches
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {conversations.map(conv => (
            <Link key={conv._id} href={`/chat/${conv._id}`}>
              <Card className={`p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer ${conv.unread_count ? 'border-primary/50 bg-primary/5' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-foreground ${conv.unread_count ? 'font-bold' : ''}`}>{conv.name}</h3>
                      {conv.unread_count ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-primary rounded-full">
                          {conv.unread_count > 9 ? '9+' : conv.unread_count}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{conv.email}</p>
                    {conv.last_message && (
                      <p className={`text-sm mt-2 truncate ${conv.unread_count ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {conv.last_message}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {conv.last_message_time && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(conv.last_message_time).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
