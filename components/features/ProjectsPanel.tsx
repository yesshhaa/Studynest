'use client'
// components/features/ProjectsPanel.tsx
import { Project } from '@/lib/db'

interface Props {
  projects:  Project[]
  onViewAll: () => void
  onAdd:     (data: Omit<Project,'id'>) => Promise<void>
}

const COLORS: Record<string, string> = {
  rose: 'bg-rose-50 border-l-rose-400',
  lavender: 'bg-lavender-50 border-l-lavender-400',
  mint: 'bg-mint-50 border-l-mint-400',
  peach: 'bg-orange-50 border-l-orange-300',
}

const COLOR_LIST = ['rose','lavender','mint','peach'] as const

export default function ProjectsPanel({ projects, onViewAll, onAdd }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Active Projects</span>
        <button className="nav-btn text-xs" onClick={onViewAll}>View all →</button>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-2 gap-3">
          {projects.map((p, i) => (
            <div
              key={p.id}
              className={`border-l-4 rounded-xl p-3 cursor-pointer hover:-translate-y-0.5 transition-transform ${COLORS[p.color] || COLORS.rose}`}
              onClick={onViewAll}
            >
              <div className="font-semibold text-xs text-ink mb-1 truncate">{p.name}</div>
              <div className="text-[10px] text-ink-muted mb-2 truncate">{p.desc}</div>
              <div className="h-1 bg-white/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full"
                  style={{ width: `${p.progress || 0}%` }}
                />
              </div>
              <div className="text-[10px] text-ink-muted mt-1">{p.progress || 0}%</div>
            </div>
          ))}
          <button
            className="border-2 border-dashed border-rose-100 rounded-xl p-3 text-ink-muted text-xs hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center justify-center gap-1 min-h-[80px]"
            onClick={async () => {
              const name = prompt('Project name:')
              if (!name) return
              await onAdd({
                name,
                desc: prompt('Short description:') || '',
                deadline: '',
                color: COLOR_LIST[projects.length % 4],
                progress: 0,
                logs: [],
              })
            }}
          >
            ＋ New Project
          </button>
        </div>
      </div>
    </div>
  )
}
