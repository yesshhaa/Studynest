'use client'
// app/page.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      router.push(user ? '/dashboard' : '/auth')
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-blobs flex items-center justify-center">
      <div className="text-center animate-pulse-soft">
        <div className="text-5xl mb-3">🌸</div>
        <p className="font-serif text-ink-muted text-lg">StudyNest</p>
      </div>
    </div>
  )
}
