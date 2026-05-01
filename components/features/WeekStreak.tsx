'use client'
// components/features/WeekStreak.tsx
import { Task } from '@/lib/db'
import { format, startOfWeek, addDays } from 'date-fns'

export default function WeekStreak({ tasks }: { tasks: Task[] }) {
  const weekStart = startOfWeek(new Date())
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const today = new Date()

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">This Week</span>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} className="text-[9px] font-bold text-ink-muted mb-1">{d}</div>
          ))}
          {days.map((day, i) => {
            const key    = format(day, 'yyyy-MM-dd')
            const done   = tasks.filter(t => t.date === key && t.done).length
            const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
            const isPast  = day < today

            return (
              <div
                key={i}
                title={`${format(day, 'MMM d')}: ${done} tasks done`}
                className={`rounded-md transition-all ${isToday ? 'h-6' : 'h-3'} ${
                  done > 0
                    ? 'bg-rose-400'
                    : isToday
                    ? 'bg-rose-200'
                    : isPast
                    ? 'bg-rose-100'
                    : 'bg-cream-200'
                }`}
              />
            )
          })}
        </div>
        <p className="text-[10px] text-ink-muted text-center mt-3">
          {tasks.filter(t => t.date === format(today, 'yyyy-MM-dd') && t.done).length} tasks completed today
        </p>
      </div>
    </div>
  )
}
