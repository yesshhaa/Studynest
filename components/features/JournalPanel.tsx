'use client'
// components/features/JournalPanel.tsx
import { useState } from 'react'
import { JournalEntry } from '@/lib/db'

interface Props {
  entries:   JournalEntry[]
  onSave:    (text: string, mood: string) => Promise<void>
  onViewAll: () => void
}

export default function JournalPanel({ entries, onSave, onViewAll }: Props) {
  const [text, setText] = useState('')

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Quick Journal</span>
        <button className="nav-btn text-xs" onClick={onViewAll}>Full journal →</button>
      </div>
      <div className="card-body space-y-3">
        <textarea
          className="input-base min-h-[90px] resize-none font-prose text-[15px] leading-relaxed"
          placeholder="What's on your mind today? A quick reflection…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          className="btn-ghost text-xs"
          onClick={async () => {
            if (!text.trim()) return
            await onSave(text.trim(), '')
            setText('')
          }}
        >
          Save entry ✓
        </button>

        {/* Recent entries */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {entries.map(e => (
            <div key={e.id} className="bg-cream-100 rounded-xl p-3 border-l-2 border-rose-200">
              <div className="text-[10px] text-ink-muted uppercase tracking-wider mb-1">
                {e.date} {e.mood}
              </div>
              <p className="font-prose text-xs text-ink leading-relaxed">
                {e.text.substring(0, 100)}{e.text.length > 100 ? '…' : ''}
              </p>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="text-xs text-ink-muted italic text-center py-2">No entries yet…</p>
          )}
        </div>
      </div>
    </div>
  )
}
