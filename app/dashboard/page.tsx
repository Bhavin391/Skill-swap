'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'

interface SkillData {
  skills_offering: string[]
  skills_learning: string[]
}

export default function DashboardPage() {
  const [skillData, setSkillData] = useState<SkillData>({
    skills_offering: [],
    skills_learning: [],
  })
  const [newOffering, setNewOffering] = useState('')
  const [newLearning, setNewLearning] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load user's skills from backend
    const token = localStorage.getItem('token')
    if (token) {
      fetch('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setSkillData({
              skills_offering: data.user.skills_offering || [],
              skills_learning: data.user.skills_learning || [],
            })
          }
        })
        .catch(err => console.error('Error loading skills:', err))
    }
  }, [])

  const addOffering = () => {
    if (newOffering.trim() && !skillData.skills_offering.includes(newOffering)) {
      setSkillData(prev => ({
        ...prev,
        skills_offering: [...prev.skills_offering, newOffering],
      }))
      setNewOffering('')
    }
  }

  const addLearning = () => {
    if (newLearning.trim() && !skillData.skills_learning.includes(newLearning)) {
      setSkillData(prev => ({
        ...prev,
        skills_learning: [...prev.skills_learning, newLearning],
      }))
      setNewLearning('')
    }
  }

  const removeOffering = (skill: string) => {
    setSkillData(prev => ({
      ...prev,
      skills_offering: prev.skills_offering.filter(s => s !== skill),
    }))
  }

  const removeLearning = (skill: string) => {
    setSkillData(prev => ({
      ...prev,
      skills_learning: prev.skills_learning.filter(s => s !== skill),
    }))
  }

  const saveSkills = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    setIsSaving(true)
    try {
      const response = await fetch('http://localhost:5000/api/users/me/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(skillData),
      })

      if (response.ok) {
        console.log('[v0] Skills saved successfully')
      }
    } catch (err) {
      console.error('[v0] Error saving skills:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Your Skills</h1>
        <p className="text-muted-foreground">
          Tell us what you can teach and what you'd like to learn
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Skills Offering */}
        <Card className="p-8 bg-card border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Can Teach</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (e.g., Python)"
                value={newOffering}
                onChange={e => setNewOffering(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addOffering()}
                className="flex-1"
              />
              <Button
                onClick={addOffering}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 mt-6">
              {skillData.skills_offering.map(skill => (
                <div
                  key={skill}
                  className="flex items-center justify-between bg-primary/10 border border-primary/30 px-4 py-3 rounded-lg"
                >
                  <span className="text-foreground font-medium">{skill}</span>
                  <button
                    onClick={() => removeOffering(skill)}
                    className="text-muted-foreground hover:text-destructive transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {skillData.skills_offering.length === 0 && (
                <p className="text-muted-foreground text-sm py-6 text-center">
                  Add skills you can teach
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Skills Learning */}
        <Card className="p-8 bg-card border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Want to Learn</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (e.g., JavaScript)"
                value={newLearning}
                onChange={e => setNewLearning(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addLearning()}
                className="flex-1"
              />
              <Button
                onClick={addLearning}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 mt-6">
              {skillData.skills_learning.map(skill => (
                <div
                  key={skill}
                  className="flex items-center justify-between bg-primary/10 border border-primary/30 px-4 py-3 rounded-lg"
                >
                  <span className="text-foreground font-medium">{skill}</span>
                  <button
                    onClick={() => removeLearning(skill)}
                    className="text-muted-foreground hover:text-destructive transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {skillData.skills_learning.length === 0 && (
                <p className="text-muted-foreground text-sm py-6 text-center">
                  Add skills you'd like to learn
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-12 flex justify-center">
        <Button
          onClick={saveSkills}
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
        >
          {isSaving ? 'Saving...' : 'Save Skills & Find Matches'}
        </Button>
      </div>
    </main>
  )
}
