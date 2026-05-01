'use client'
// app/page.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // If user is logged in, quietly redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Show a cute loader while checking auth state
  if (loading || user) {
    return (
      <div className="min-h-screen bg-blobs flex items-center justify-center">
        <div className="animate-pulse-soft text-5xl">🌸</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blobs flex flex-col relative text-ink px-6">
      
      {/* Navigation */}
      <nav className="w-full max-w-5xl mx-auto py-6 flex items-center justify-between z-10 animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🌸</div>
          <span className="font-serif text-xl">StudyNest</span>
        </div>
        <Link href="/auth" className="btn-ghost shadow-sm bg-white/50 backdrop-blur-sm">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-3xl mx-auto -mt-10">
        
        <div className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-500 font-medium text-xs tracking-wider uppercase mb-6 animate-slide-up">
          Welcome to your new study space
        </div>

        <h1 className="font-serif text-5xl md:text-7xl text-balance leading-tight mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          Your <span className="text-rose-500">cozy</span> corner <br className="hidden md:block"/> for deeper focus.
        </h1>
        
        <p className="text-ink-muted text-lg md:text-xl font-light mb-10 text-balance animate-slide-up" style={{ animationDelay: '200ms' }}>
          Track your tasks, build unbreakable study habits, and reflect on your days. Everything you need to succeed, wrapped in a peaceful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <Link href="/auth" className="btn-primary py-3 px-8 text-base shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5">
            Get Started Free ✨
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-ghost py-3 px-8 text-base bg-white/60">
            View Source Code
          </a>
        </div>
      </main>

      {/* Features Preview */}
      <div className="w-full max-w-5xl mx-auto pb-20 z-10 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <FeatureCard 
          icon="📋" 
          title="Task Management" 
          desc="Organize your study tasks, projects, and urgent deadlines effortlessly." 
        />
        <FeatureCard 
          icon="⏱️" 
          title="Pomodoro Timer" 
          desc="Stay productive with focus sessions uniquely tailored for maximum retention." 
        />
        <FeatureCard 
          icon="📖" 
          title="Daily Journal" 
          desc="Reflect on your daily progress and track your learning moods visually." 
        />
      </div>

    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="card bg-white/60 hover:bg-white/90 transition-all duration-300">
      <div className="card-body flex flex-col items-start text-left gap-3">
        <div className="text-3xl bg-cream-50 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner-soft">
          {icon}
        </div>
        <h3 className="font-serif text-xl text-ink mt-2">{title}</h3>
        <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
