'use client'
// components/features/MiniCalendar.tsx
import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from 'date-fns'
import { Task } from '@/lib/db'

export default function MiniCalendar({ tasks }: { tasks: Task[] }) {
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState<Date | null>(null)

  const monthStart = startOfMonth(current)
  const monthEnd   = endOfMonth(current)
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDow   = getDay(monthStart)

  const selectedTasks = selected
    ? tasks.filter(t => t.date === format(selected, 'yyyy-MM-dd'))
    : []

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Calendar</span>
      </div>
      <div className="card-body space-y-3">
        {/* Nav */}
        <div className="flex items-center justify-between">
          <button
            className="text-ink-muted hover:text-ink p-1 rounded hover:bg-rose-50"
            onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1))}
          >
            ‹
          </button>
          <span className="font-serif text-sm text-ink">
            {format(current, 'MMMM yyyy')}
          </span>
          <button
            className="text-ink-muted hover:text-ink p-1 rounded hover:bg-rose-50"
            onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1))}
          >
            ›
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="text-[9px] font-bold text-ink-muted py-1 uppercase">{d}</div>
          ))}
          {/* Blank cells */}
          {Array.from({ length: startDow }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {/* Day cells */}
          {days.map(day => {
            const key     = format(day, 'yyyy-MM-dd')
            const hasTask = tasks.some(t => t.date === key)
            const today   = isToday(day)
            const isSel   = selected && isSameDay(day, selected)

            return (
              <button
                key={key}
                onClick={() => setSelected(isSel ? null : day)}
                className={`relative text-[11px] py-1 rounded-md transition-all ${
                  isSel
                    ? 'bg-rose-400 text-white'
                    : today
                    ? 'bg-rose-100 text-rose-600 font-bold'
                    : 'text-ink-light hover:bg-rose-50'
                }`}
              >
                {format(day, 'd')}
                {hasTask && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-lavender-400" />
                )}
              </button>
            )
          })}
        </div>

        {/* Selected day tasks */}
        <div className="border-t border-rose-100 pt-3">
          <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2">
            {selected ? format(selected, 'MMM d') : 'Selected Day'}
          </div>
          {selectedTasks.length === 0 ? (
            <p className="text-xs text-ink-muted italic">
              {selected ? 'No tasks this day' : 'Click a date to view tasks'}
            </p>
          ) : (
            <div className="space-y-1">
              {selectedTasks.map(t => (
                <div key={t.id} className="flex items-center gap-2 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.done ? 'bg-mint-400' : 'bg-rose-300'}`} />
                  <span className={t.done ? 'line-through text-ink-muted' : 'text-ink-light'}>{t.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
