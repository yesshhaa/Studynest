'use client'
// lib/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  onAuthStateChanged, User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup, signOut as fbSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { saveUserProfile } from './db'

interface AuthCtx {
  user:        User | null
  loading:     boolean
  signIn:      (email: string, pass: string) => Promise<void>
  signUp:      (name: string, email: string, pass: string) => Promise<void>
  signInGoogle:() => Promise<void>
  signOut:     () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false) })
    return unsub
  }, [])

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass)
  }

  const signUp = async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass)
    try { await updateProfile(cred.user, { displayName: name }) } catch(e) { console.error(e) }
    try { await saveUserProfile(cred.user.uid, { name, email }) } catch(e) { console.error('Firestore save fail:', e) }
  }

  const signInGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider)
    try {
      await saveUserProfile(cred.user.uid, {
        name:  cred.user.displayName || '',
        email: cred.user.email || '',
      })
    } catch(e) { console.error('Firestore save fail:', e) }
  }

  const signOut = () => fbSignOut(auth)

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signInGoogle, signOut }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
