// app/layout.tsx
import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display, Crimson_Pro } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/AuthContext'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300','400','500','600'],
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: '400',
  style: ['normal','italic'],
})

const crimson = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-prose',
  weight: ['300','400'],
  style: ['normal','italic'],
})

export const metadata: Metadata = {
  title: 'StudyNest — My Personal Study Dashboard',
  description: 'A personal productivity dashboard built by a student, for students. Track tasks, projects, journal entries and study sessions.',
  openGraph: {
    title: 'StudyNest — Personal Study Dashboard',
    description: 'Built by a cybersecurity student. Tasks · Journal · Projects · Pomodoro.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable} ${crimson.variable}`}>
      <body className="font-sans bg-cream-50 text-ink antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#2e2626',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '500',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
