'use client'
// app/dashboard/page.tsx
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import {
  getTasks, addTask, toggleTask, deleteTask, Task,
  getProjects, addProject, updateProject, deleteProject, Project,
  getJournals, addJournal, JournalEntry,
  getTopics, addTopic, Topic,
} from '@/lib/db'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// ── Sub-components ────────────────────────────────
import Header       from '@/components/layout/Header'
import MiniCalendar from '@/components/features/MiniCalendar'
import PomodoroTimer from '@/components/features/PomodoroTimer'
import TaskPanel    from '@/components/features/TaskPanel'
import ProjectsPanel from '@/components/features/ProjectsPanel'
import JournalPanel from '@/components/features/JournalPanel'
import TopicsPanel  from '@/components/features/TopicsPanel'
import WeekStreak   from '@/components/features/WeekStreak'

const today = () => new Date().toISOString().split('T')[0]

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [tasks,    setTasks]    = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [journals, setJournals] = useState<JournalEntry[]>([])
  const [topics,   setTopics]   = useState<Topic[]>([])
  const [fetching, setFetching] = useState(true)
  const [view,     setView]     = useState<'dashboard'|'projects'|'journal'>('dashboard')

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading, router])

  const load = useCallback(async () => {
    if (!user) return
    setFetching(true)
    const [t, p, j, tp] = await Promise.all([
      getTasks(user.uid),
      getProjects(user.uid),
      getJournals(user.uid),
      getTopics(user.uid),
    ])
    setTasks(t); setProjects(p); setJournals(j); setTopics(tp)
    setFetching(false)
  }, [user])

  useEffect(() => { load() }, [load])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-blobs flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-4xl mb-4">🌸</div>
          <p className="text-ink-muted font-serif text-lg">Loading your nest…</p>
        </div>
      </div>
    )
  }

  const todayTasks = tasks.filter(t => t.date === today())
  const doneTasks  = todayTasks.filter(t => t.done)
  const streak     = calcStreak(tasks)

  // Greeting
  const h = new Date().getHours()
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  const name = user.displayName?.split(' ')[0] || 'friend'

  return (
    <div className="bg-blobs min-h-screen">
      <Header view={view} setView={setView} user={user} />

      <main className="relative z-10 max-w-[1380px] mx-auto px-6 py-6">

        {/* ── DASHBOARD VIEW ── */}
        {view === 'dashboard' && (
          <div className="space-y-5">
            {/* Greeting banner */}
            <div className="bg-gradient-to-r from-white/90 via-rose-50/80 to-lavender-50/70 border border-rose-100 rounded-3xl p-6 flex items-center justify-between shadow-soft animate-slide-up">
              <div>
                <h1 className="font-serif text-3xl text-ink">
                  {greeting}, {name} ✨
                </h1>
                <p className="text-ink-muted text-sm mt-1">
                  {format(new Date(), 'EEEE, MMMM do')} · Here&apos;s your focus plan
                </p>
              </div>
              <div className="flex gap-4 items-center">
                {[
                  { num: todayTasks.length, lbl: 'Tasks' },
                  { num: doneTasks.length,  lbl: 'Done' },
                  { num: `🔥${streak}`,    lbl: 'Streak' },
                ].map(s => (
                  <div key={s.lbl} className="text-center bg-white/70 border border-rose-100 rounded-2xl px-4 py-3 min-w-[72px]">
                    <div className="text-xl font-semibold text-ink leading-tight">{s.num}</div>
                    <div className="text-[10px] text-ink-muted uppercase tracking-wider mt-1">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-[280px_1fr_260px] gap-5 items-start">

              {/* LEFT */}
              <div className="flex flex-col gap-4">
                <MiniCalendar tasks={tasks} />
                <PomodoroTimer />
              </div>

              {/* CENTER */}
              <div className="flex flex-col gap-4">
                <TaskPanel
                  tasks={todayTasks}
                  onAdd={async (text, tag) => {
                    await addTask(user.uid, { text, tag, done: false, date: today() })
                    toast.success('Task added!')
                    load()
                  }}
                  onToggle={async (id, done) => {
                    await toggleTask(user.uid, id, done)
                    load()
                  }}
                  onDelete={async id => {
                    await deleteTask(user.uid, id)
                    toast.success('Task removed')
                    load()
                  }}
                />
                <ProjectsPanel
                  projects={projects.slice(0, 4)}
                  onViewAll={() => setView('projects')}
                  onAdd={async data => {
                    await addProject(user.uid, data)
                    toast.success('Project created! 🎉')
                    load()
                  }}
                />
              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-4">
                <JournalPanel
                  entries={journals.slice(-3).reverse()}
                  onSave={async (text, mood) => {
                    await addJournal(user.uid, { text, mood, date: today() })
                    toast.success('Journal saved! 📖')
                    load()
                  }}
                  onViewAll={() => setView('journal')}
                />
                <TopicsPanel
                  topics={topics}
                  onAdd={async data => {
                    await addTopic(user.uid, data)
                    toast.success('Topic added!')
                    load()
                  }}
                />
                <WeekStreak tasks={tasks} />
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECTS VIEW ── */}
        {view === 'projects' && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-ink">My Projects</h2>
              <button
                className="btn-primary"
                onClick={async () => {
                  const name = prompt('Project name:')
                  if (!name) return
                  await addProject(user.uid, {
                    name,
                    desc: prompt('Description:') || '',
                    deadline: '',
                    color: 'rose',
                    progress: 0,
                    logs: [],
                  })
                  toast.success('Project created! 🎉')
                  load()
                }}
              >
                + New Project
              </button>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {projects.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onLog={async (text, progress) => {
                    const logs = [...(p.logs || []), { date: today(), text }]
                    await updateProject(user.uid, p.id, { logs, progress })
                    toast.success('Progress logged!')
                    load()
                  }}
                  onDelete={async () => {
                    await deleteProject(user.uid, p.id)
                    toast.success('Project deleted')
                    load()
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── JOURNAL VIEW ── */}
        {view === 'journal' && (
          <div className="grid grid-cols-[1fr_320px] gap-5 animate-slide-up">
            <FullJournal
              onSave={async (text, mood) => {
                await addJournal(user.uid, { text, mood, date: today() })
                toast.success('Entry saved! 📖')
                load()
              }}
            />
            <div>
              <h3 className="font-serif text-xl text-ink mb-4">Past Entries</h3>
              <div className="flex flex-col gap-3">
                {journals.slice().reverse().map(e => (
                  <div key={e.id} className="card p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-ink-muted uppercase tracking-wider">{e.date}</span>
                      <span>{e.mood}</span>
                    </div>
                    <p className="font-prose text-sm text-ink-light leading-relaxed">
                      {e.text.substring(0, 140)}{e.text.length > 140 ? '…' : ''}
                    </p>
                  </div>
                ))}
                {journals.length === 0 && (
                  <p className="text-center text-ink-muted text-sm italic py-8">
                    No journal entries yet. Start writing! 📖
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-xs text-ink-muted">
        <span>Built by a student, for students 🌸</span>
        <span className="mx-2">·</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-rose-500 transition-colors"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  )
}

// ── Helper: calc streak ───────────────────────────
function calcStreak(tasks: Task[]) {
  let streak = 0
  const d = new Date()
  for (let i = 0; i < 365; i++) {
    const k = d.toISOString().split('T')[0]
    if (tasks.some(t => t.date === k && t.done)) { streak++; d.setDate(d.getDate() - 1) }
    else break
  }
  return streak
}

// ── Project Card ──────────────────────────────────
function ProjectCard({ project: p, onLog, onDelete }: {
  project: Project
  onLog: (text: string, progress: number) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const colors: Record<string, string> = {
    rose: 'border-l-rose-400', lavender: 'border-l-lavender-400',
    mint: 'border-l-mint-400', peach: 'border-l-orange-300',
  }

  return (
    <div className={`card border-l-4 ${colors[p.color]} flex flex-col`}>
      <div className="card-header">
        <div>
          <div className="font-semibold text-ink text-sm">{p.name}</div>
          <div className="text-xs text-ink-muted mt-0.5">{p.desc}</div>
        </div>
      </div>
      <div className="card-body flex-1 flex flex-col gap-3">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-ink-muted mb-1.5">
            <span>Progress</span><span>{p.progress || 0}%</span>
          </div>
          <div className="h-1.5 bg-rose-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${p.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Logs */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest">Log</div>
          {(p.logs || []).slice(-3).reverse().map((l, i) => (
            <div key={i} className="bg-cream-50 rounded-lg p-2.5">
              <div className="text-[10px] text-ink-muted mb-1">{l.date}</div>
              <div className="text-xs text-ink">{l.text}</div>
            </div>
          ))}
          {!(p.logs?.length) && <p className="text-xs text-ink-muted italic">No logs yet</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            className="btn-ghost text-xs flex-1"
            onClick={async () => {
              const text = prompt('What did you accomplish?')
              if (!text) return
              const prog = parseInt(prompt('Progress %?') || String(p.progress)) || p.progress
              await onLog(text, prog)
            }}
          >
            + Log
          </button>
          <button
            className="btn-ghost text-xs text-rose-400"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Full Journal Editor ────────────────────────────
function FullJournal({ onSave }: { onSave: (text: string, mood: string) => Promise<void> }) {
  const [text, setText] = useState('')
  const [mood, setMood] = useState('')
  const moods = ['😊','😤','😴','🤔','🔥','😟']

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="font-serif text-xl text-ink font-normal">Today&apos;s Entry</h2>
        <span className="text-xs text-ink-muted">{format(new Date(), 'EEEE, MMMM do yyyy')}</span>
      </div>
      <div className="card-body">
        <textarea
          className="w-full min-h-[280px] border-none bg-transparent font-prose text-lg text-ink leading-[1.9] resize-none outline-none placeholder:text-ink-muted placeholder:italic"
          placeholder="Write freely… What did you learn? What challenged you? What are you grateful for?"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="flex items-center gap-2 pt-4 border-t border-rose-100 mt-4">
          <span className="text-xs text-ink-muted">Mood:</span>
          {moods.map(m => (
            <button
              key={m}
              onClick={() => setMood(m === mood ? '' : m)}
              className={`text-base px-2 py-1 rounded-xl border transition-all ${
                mood === m
                  ? 'border-rose-300 bg-rose-50'
                  : 'border-transparent hover:border-rose-200'
              }`}
            >
              {m}
            </button>
          ))}
          <div className="flex-1" />
          <button
            className="btn-primary"
            onClick={async () => {
              if (!text.trim()) return
              await onSave(text.trim(), mood)
              setText(''); setMood('')
            }}
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  )
}
