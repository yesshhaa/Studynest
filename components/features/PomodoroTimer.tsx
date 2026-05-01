'use client'
// components/features/PomodoroTimer.tsx
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

type Mode = 'focus' | 'short' | 'long'

const MODES: Record<Mode, { label: string; mins: number }> = {
  focus: { label: 'Focus Session', mins: 25 },
  short: { label: 'Short Break',   mins: 5  },
  long:  { label: 'Long Break',    mins: 15 },
}

export default function PomodoroTimer() {
  const [mode,     setMode]     = useState<Mode>('focus')
  const [seconds,  setSeconds]  = useState(25 * 60)
  const [running,  setRunning]  = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const total = MODES[mode].mins * 60

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            if (mode === 'focus') {
              setSessions(n => (n + 1) % 4)
              toast.success('🍅 Focus session complete! Take a break.')
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode])

  const switchMode = (m: Mode) => {
    setMode(m); setRunning(false); setSeconds(MODES[m].mins * 60)
  }

  const reset = () => { setRunning(false); setSeconds(MODES[mode].mins * 60) }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const pct = (seconds / total) * 100

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Pomodoro Timer</span>
        <span className="text-xs text-ink-muted">Session {sessions + 1}</span>
      </div>
      <div className="card-body space-y-3">
        {/* Mode tabs */}
        <div className="flex gap-1 bg-cream-100 rounded-xl p-0.5">
          {(Object.entries(MODES) as [Mode, typeof MODES[Mode]][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                mode === key
                  ? 'bg-white text-ink shadow-soft'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {key === 'focus' ? 'Focus' : key === 'short' ? 'Short' : 'Long'}
            </button>
          ))}
        </div>

        {/* Time display */}
        <div className="text-center py-2">
          <div className="font-serif text-5xl text-ink tracking-tight">{mm}:{ss}</div>
          <div className="text-[10px] text-ink-muted uppercase tracking-widest mt-2">
            {MODES[mode].label}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-rose-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-lavender-400 rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <button className="btn-ghost text-xs" onClick={reset}>↺ Reset</button>
          <button
            className="btn-primary px-6"
            onClick={() => setRunning(r => !r)}
          >
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
        </div>

        {/* Session dots */}
        <div className="flex gap-1.5 justify-center">
          {[0,1,2,3].map(i => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < sessions % 4 ? 'bg-rose-400' : 'bg-rose-100'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
