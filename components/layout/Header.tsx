'use client'
// components/layout/Header.tsx
import { User } from 'firebase/auth'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Props {
  view: 'dashboard' | 'projects' | 'journal'
  setView: (v: 'dashboard' | 'projects' | 'journal') => void
  user: User
}

export default function Header({ view, setView, user }: Props) {
  const { signOut } = useAuth()
  const router = useRouter()

  const initials = (user.displayName || user.email || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'projects',  label: 'Projects'  },
    { key: 'journal',   label: 'Journal'   },
  ] as const

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100 px-6 h-14 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-rose-200 to-lavender-200 rounded-xl flex items-center justify-center text-base shadow-soft">
          🌸
        </div>
        <span className="font-serif text-lg text-ink">StudyNest</span>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {navItems.map(n => (
          <button
            key={n.key}
            onClick={() => setView(n.key)}
            className={`nav-btn ${view === n.key ? 'nav-btn-active' : ''}`}
          >
            {n.label}
          </button>
        ))}
      </nav>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-muted hidden md:block">
          {format(new Date(), 'EEE, MMM d')}
        </span>
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-3 py-1">
          <div className="w-6 h-6 rounded-full bg-rose-300 flex items-center justify-center text-white text-[10px] font-bold">
            {initials}
          </div>
          <span className="text-xs font-medium text-rose-600">
            {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
          </span>
        </div>
        <button
          className="btn-ghost text-xs"
          onClick={async () => {
            await signOut()
            toast.success('Signed out 👋')
            router.push('/auth')
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
