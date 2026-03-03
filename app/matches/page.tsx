'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/matches', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setMatches(data.matches || [])
      } else {
        setError('Failed to load matches')
      }
    } catch (err) {
      console.error('[v0] Error loading matches:', err)
      setError('Error loading matches')
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
              <Link href={`/chat/${match._id}`} className="mt-auto pt-4">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
