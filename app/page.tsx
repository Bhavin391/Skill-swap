'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, Users, MessageSquare, TrendingUp, Zap, Shield } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <section className="px-6 py-16 md:py-28 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Join the Learning Revolution</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Exchange Skills, <br />
            <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">Grow Together</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connect with peers who want to learn what you know. Share your expertise, discover new skills, and build meaningful relationships in our global peer-to-peer learning community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 px-8 group">
                <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Start Learning Today
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary/50 transition-all duration-300 px-8">
                Already a Member?
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <Card className="p-8 bg-card border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-lg">Smart Matching</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered algorithm finds perfect learning partners based on your skills and learning goals.
            </p>
          </Card>

          <Card className="p-8 bg-card border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-lg">Live Messaging</h3>
            <p className="text-sm text-muted-foreground">
              Real-time chat with read receipts to coordinate learning sessions with your peers.
            </p>
          </Card>

          <Card className="p-8 bg-card border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-lg">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your learning journey and celebrate milestones with your skill exchange partners.
            </p>
          </Card>
        </div>
      </section>



      {/* CTA Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to Transform Your Skills?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join a global community of learners who are expanding their expertise through meaningful peer-to-peer connections.
          </p>
        </div>
        <Link href="/signup">
          <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 px-8 group">
            <Sparkles className="w-4 h-4 mr-2 group-hover:animate-spin" />
            Start Your Journey Free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2026 SkillSwap. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
