'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="font-semibold text-foreground">SkillSwap</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground hover:bg-secondary">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Exchange Skills,{' '}
            <span className="text-primary">Grow Together</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with peers who want to learn what you know. Share your expertise, discover new skills, and build meaningful relationships in our global learning community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                Start Learning
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary px-8">
                Already a Member?
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Skill Matching</h3>
            <p className="text-sm text-muted-foreground">
              Find the perfect learning partners based on complementary skills and interests.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Instant Messaging</h3>
            <p className="text-sm text-muted-foreground">
              Chat directly with matched peers and schedule your learning sessions.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Mutual Growth</h3>
            <p className="text-sm text-muted-foreground">
              Learn and teach simultaneously in a peer-to-peer exchange model.
            </p>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-primary/5 border-y border-border">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">10K+</p>
            <p className="text-muted-foreground text-sm mt-1">Active Learners</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">500+</p>
            <p className="text-muted-foreground text-sm mt-1">Skills Shared</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">95%</p>
            <p className="text-muted-foreground text-sm mt-1">Satisfaction Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">25K+</p>
            <p className="text-muted-foreground text-sm mt-1">Matches Made</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of learners who are expanding their skills through peer-to-peer exchange.
        </p>
        <Link href="/signup">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
            Sign Up Free
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
