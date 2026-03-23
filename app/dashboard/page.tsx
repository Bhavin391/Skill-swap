'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, X, Sparkles, TrendingUp } from 'lucide-react'

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
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Build Your Profile</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-3">Your Skills</h1>
          <p className="text-lg text-muted-foreground">Tell us what you can teach and what you'd like to learn to find perfect matches</p>
        </div>

        {/* Skills Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Can Teach */}
          <Card className="p-8 bg-card border-border/50 hover:border-primary/30 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Can Teach</h2>
                <p className="text-sm text-muted-foreground">Skills you can share</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Python, Guitar, Design..."
                  value={newOffering}
                  onChange={e => setNewOffering(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addOffering()}
                  className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
                <Button
                  onClick={addOffering}
                  className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 group"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {skillData.skills_offering.map((skill, i) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-blue-500/10 px-4 py-3 rounded-lg border border-primary/20 hover:border-primary/50 transition-all duration-200 animate-in fade-in slide-in-from-left"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className="text-foreground font-medium">{skill}</span>
                    <button
                      onClick={() => removeOffering(skill)}
                      className="text-muted-foreground hover:text-destructive transition-colors duration-200 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Want to Learn */}
          <Card className="p-8 bg-card border-border/50 hover:border-primary/30 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Want to Learn</h2>
                <p className="text-sm text-muted-foreground">Skills you'd like to acquire</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., JavaScript, Yoga, Marketing..."
                  value={newLearning}
                  onChange={e => setNewLearning(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addLearning()}
                  className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
                <Button
                  onClick={addLearning}
                  className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 group"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {skillData.skills_learning.map((skill, i) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-blue-500/10 px-4 py-3 rounded-lg border border-primary/20 hover:border-primary/50 transition-all duration-200 animate-in fade-in slide-in-from-right"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className="text-foreground font-medium">{skill}</span>
                    <button
                      onClick={() => removeLearning(skill)}
                      className="text-muted-foreground hover:text-destructive transition-colors duration-200 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={saveSkills}
            disabled={isSaving}
            className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 px-8 py-6 text-lg group disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Saving Skills...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                Save Skills & Find Matches
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
