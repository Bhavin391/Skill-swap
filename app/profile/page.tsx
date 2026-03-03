'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface UserProfile {
  _id: string
  name: string
  email: string
  skills_offering: string[]
  skills_learning: string[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
      }
    } catch (err) {
      console.error('[v0] Error loading profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !profile) {
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
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account and skills</p>
      </div>

      <Card className="p-8 bg-card border-border mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <Input
              value={profile.name}
              disabled
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              value={profile.email}
              disabled
              type="email"
              className="w-full"
            />
          </div>
        </div>
      </Card>

      <Card className="p-8 bg-card border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Skills Overview</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Can Teach</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills_offering.length === 0 ? (
                <p className="text-muted-foreground text-sm">No skills added yet</p>
              ) : (
                profile.skills_offering.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Want to Learn</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills_learning.length === 0 ? (
                <p className="text-muted-foreground text-sm">No skills added yet</p>
              ) : (
                profile.skills_learning.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={() => window.location.href = '/dashboard'}
          className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Update Skills
        </Button>
      </Card>
    </main>
  )
}
