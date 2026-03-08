'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { MessageSquare, Star } from 'lucide-react'

interface Match {
  _id: string
  name: string
  email: string
  skills_offering: string[]
  skills_learning: string[]
  match_score: number
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [initiatingChat, setInitiatingChat] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Authentication required')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      console.log('[v0] Loading matches...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch('http://localhost:5000/api/matches', {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        console.log('[v0] Matches loaded:', data.matches?.length || 0)
        setMatches(data.matches || [])
        setError('')
      } else {
        console.error('[v0] Matches response error:', response.status)
        setError(`Failed to load matches: ${response.statusText}`)
      }
    } catch (err: any) {
      console.error('[v0] Error loading matches:', err)
      const errorMsg = err.name === 'AbortError'
        ? 'Connection timeout - Backend server not responding'
        : `Error loading matches: ${err.message}`
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const initiateChatWithMatch = async (userId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Authentication required')
      return
    }

    setInitiatingChat(userId)
    try {
      console.log('[v0] Initiating chat with user:', userId)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`http://localhost:5000/api/chats/init/${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        console.log('[v0] Chat initiated, chat_id:', data.chat_id)
        router.push(`/chat/${data.chat_id}`)
      } else {
        console.error('[v0] Chat init response error:', response.status)
        setError(`Failed to start chat: ${response.statusText}`)
      }
    } catch (err: any) {
      console.error('[v0] Error initiating chat:', err)
      const errorMsg = err.name === 'AbortError'
        ? 'Connection timeout - Failed to start chat'
        : `Error starting chat: ${err.message}`
      setError(errorMsg)
    } finally {
      setInitiatingChat(null)
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
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Your Matches</h1>
        <p className="text-muted-foreground">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'} found based on your skills
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {matches.length === 0 ? (
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground mb-6">
            No matches yet. Add more skills to find learning partners!
          </p>
          <Link href="/dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Update Your Skills
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <Card
              key={match._id}
              className="p-6 bg-card border-border hover:border-primary/50 transition-colors flex flex-col"
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-foreground">{match.name}</h3>
                <p className="text-sm text-muted-foreground">{match.email}</p>
              </div>

              {/* Match Score */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(match.match_score / 20)
                            ? 'fill-primary text-primary'
                            : 'text-border'
                        }`}
                      />
                    ))}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {Math.round(match.match_score)}% Match
                </span>
              </div>

              {/* Skills They Offer */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Can Teach
                </p>
                <div className="flex flex-wrap gap-2">
                  {match.skills_offering.slice(0, 3).map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {match.skills_offering.length > 3 && (
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      +{match.skills_offering.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Skills They Want */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Wants to Learn
                </p>
                <div className="flex flex-wrap gap-2">
                  {match.skills_learning.slice(0, 3).map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {match.skills_learning.length > 3 && (
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      +{match.skills_learning.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Message Button */}
              <div className="mt-auto pt-4">
                <Button 
                  onClick={() => initiateChatWithMatch(match._id)}
                  disabled={initiatingChat === match._id}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {initiatingChat === match._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Starting chat...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
