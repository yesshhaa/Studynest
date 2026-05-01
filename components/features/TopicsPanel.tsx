'use client'
// components/features/TopicsPanel.tsx
import { useState } from 'react'
import { Topic } from '@/lib/db'

const ICONS = ['📡','💻','🔒','🌐','🦈','🔐','⚙️','📊','🖥','🗂']
const BADGE_STYLES: Record<string, string> = {
  new:    'bg-mint-50 text-mint-400',
  review: 'bg-lavender-50 text-lavender-500',
  due:    'bg-rose-50 text-rose-500',
}

interface Props {
  topics: Topic[]
  onAdd:  (data: Omit<Topic,'id'>) => Promise<void>
}

export default function TopicsPanel({ topics, onAdd }: Props) {
  const [adding, setAdding] = useState(false)
  const [name,   setName]   = useState('')
  const [sub,    setSub]    = useState('')
  const [badge,  setBadge]  = useState<Topic['badge']>('new')

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Study Topics</span>
        <button
          onClick={() => setAdding(a => !a)}
          className="text-ink-muted hover:text-ink text-lg leading-none"
        >
          {adding ? '×' : '+'}
        </button>
      </div>
      <div className="card-body space-y-2">
        {adding && (
          <div className="bg-rose-50 rounded-xl p-3 space-y-2 mb-3">
            <input
              className="input-base text-xs"
              placeholder="Topic name…"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="input-base text-xs"
              placeholder="Sub-topic / chapter…"
              value={sub}
              onChange={e => setSub(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="input-base text-xs flex-1"
                value={badge}
                onChange={e => setBadge(e.target.value as Topic['badge'])}
              >
                <option value="new">New</option>
                <option value="review">Review</option>
                <option value="due">Due Soon</option>
              </select>
              <button
                className="btn-primary text-xs"
                onClick={async () => {
                  if (!name.trim()) return
                  await onAdd({
                    name: name.trim(),
                    sub: sub.trim(),
                    badge,
                    icon: ICONS[topics.length % ICONS.length],
                  })
                  setName(''); setSub(''); setAdding(false)
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}

        {topics.length === 0 && !adding && (
          <p className="text-xs text-ink-muted italic text-center py-2">No topics yet — add one!</p>
        )}

        {topics.map(tp => (
          <div key={tp.id} className="flex items-center gap-2.5 py-2 border-b border-rose-50 last:border-0">
            <div className="w-7 h-7 rounded-lg bg-lavender-50 flex items-center justify-center text-sm flex-shrink-0">
              {tp.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-ink truncate">{tp.name}</div>
              <div className="text-[10px] text-ink-muted truncate">{tp.sub}</div>
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[tp.badge]}`}>
              {tp.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
