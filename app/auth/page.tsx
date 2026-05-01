'use client'
// app/auth/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const { signIn, signUp, signInGoogle } = useAuth()
  const router = useRouter()

  const [tab,      setTab]      = useState<'login'|'signup'>('login')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const friendly: Record<string,string> = {
    'auth/user-not-found':      'No account with this email.',
    'auth/wrong-password':      'Incorrect password.',
    'auth/email-already-in-use':'Email already in use — try signing in.',
    'auth/weak-password':       'Password must be at least 6 characters.',
    'auth/invalid-email':       'Invalid email address.',
    'auth/unauthorized-domain': 'This domain is not authorized in Firebase settings.',
    'auth/invalid-api-key':     'Firebase API Key missing. You must redeploy your app on Vercel!',
    'auth/popup-closed-by-user':'You closed the popup before finishing.',
  }

  const handle = async (fn: () => Promise<void>) => {
    setLoading(true); setError('')
    try { await fn(); router.push('/dashboard') }
    catch (e: any) { setError(friendly[e.code] || 'Something went wrong. Try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="bg-blobs min-h-screen flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-200 to-lavender-200 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-soft">
            🌸
          </div>
          <h1 className="font-serif text-3xl text-ink">StudyNest</h1>
          <p className="text-ink-muted text-sm mt-1">Your personal study space</p>
        </div>

        {/* Card */}
        <div className="card animate-slide-up">
          {/* Tabs */}
          <div className="flex bg-cream-100 rounded-xl p-1 mb-6">
            {(['login','signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t
                    ? 'bg-white text-ink shadow-soft'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="card-body pt-0 flex flex-col gap-3">
            {/* Error */}
            {error && (
              <div className="bg-rose-50 text-rose-600 text-sm px-3 py-2 rounded-xl">
                {error}
              </div>
            )}

            {/* Name field (signup only) */}
            {tab === 'signup' && (
              <input
                className="input-base"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            )}

            <input
              className="input-base"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              className="input-base"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (tab === 'login') handle(() => signIn(email, password))
                  else handle(() => signUp(name, email, password))
                }
              }}
            />

            <button
              className="btn-primary w-full py-3 mt-1"
              disabled={loading}
              onClick={() => {
                if (tab === 'login') handle(() => signIn(email, password))
                else handle(() => signUp(name, email, password))
              }}
            >
              {loading ? 'Please wait…' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>

            <div className="text-center text-xs text-ink-muted my-1">or</div>

            {/* Google */}
            <button
              className="btn-ghost w-full py-3 flex items-center justify-center gap-2"
              onClick={() => handle(signInGoogle)}
              disabled={loading}
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>
        </div>

        {/* Footer credit */}
        <p className="text-center text-xs text-ink-muted mt-6">
          Built by a student, for students 🌸
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}
