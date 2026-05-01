'use client'
// components/features/TaskPanel.tsx
import { useState } from 'react'
import { Task } from '@/lib/db'

interface Props {
  tasks:    Task[]
  onAdd:    (text: string, tag: Task['tag']) => Promise<void>
  onToggle: (id: string, done: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const TAG_COLORS: Record<Task['tag'], string> = {
  study:    'bg-lavender-50 text-lavender-500',
  project:  'bg-mint-50 text-mint-400',
  urgent:   'bg-rose-50 text-rose-500',
  deadline: 'bg-orange-50 text-orange-500',
}

export default function TaskPanel({ tasks, onAdd, onToggle, onDelete }: Props) {
  const [text, setText] = useState('')
  const [tag,  setTag]  = useState<Task['tag']>('study')

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Daily Focus</span>
        <span className="text-[10px] bg-lavender-50 text-lavender-500 px-3 py-1 rounded-full font-semibold">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      <div className="card-body space-y-1">
        {tasks.length === 0 && (
          <p className="text-center text-ink-muted text-sm italic py-4">
            No tasks yet — add one below!
          </p>
        )}
        {tasks.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 py-2.5 border-b border-rose-50 last:border-0 group ${t.done ? 'opacity-50' : ''}`}
          >
            <button
              onClick={() => onToggle(t.id, !t.done)}
              className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                t.done
                  ? 'bg-rose-400 border-rose-400'
                  : 'border-rose-300 hover:border-rose-400'
              }`}
            >
              {t.done && <span className="text-white text-[8px] font-bold">✓</span>}
            </button>
            <span className={`flex-1 text-sm ${t.done ? 'line-through text-ink-muted' : 'text-ink'}`}>
              {t.text}
            </span>
            <span className={`tag text-[10px] ${TAG_COLORS[t.tag]}`}>{t.tag}</span>
            <button
              onClick={() => onDelete(t.id)}
              className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-rose-400 text-sm transition-all ml-1"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add form */}
        <div className="flex gap-2 pt-2">
          <input
            className="input-base flex-1"
            placeholder="Add a task or goal…"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={async e => {
              if (e.key === 'Enter' && text.trim()) {
                await onAdd(text.trim(), tag)
                setText('')
              }
            }}
          />
          <select
            className="input-base w-28"
            value={tag}
            onChange={e => setTag(e.target.value as Task['tag'])}
          >
            <option value="study">Study</option>
            <option value="project">Project</option>
            <option value="urgent">Urgent</option>
            <option value="deadline">Deadline</option>
          </select>
          <button
            className="btn-primary"
            onClick={async () => {
              if (!text.trim()) return
              await onAdd(text.trim(), tag)
              setText('')
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
