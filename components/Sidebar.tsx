'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { getSessions } from '@/lib/api'
import { SessionSummary } from '@/lib/types'

interface Props {
  collapsed?: boolean
  onToggle?: () => void
  activeSessionId?: string
}

function groupByDate(sessions: SessionSummary[]) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const groups: Record<string, SessionSummary[]> = {}
  sessions.forEach((s) => {
    const d = new Date(s.createdAt)
    let label: string
    if (d.toDateString() === today.toDateString()) label = 'Today'
    else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday'
    else
      label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (!groups[label]) groups[label] = []
    groups[label].push(s)
  })
  return groups
}

export default function Sidebar({ collapsed = false, onToggle, activeSessionId }: Props) {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionSummary[]>([])

  useEffect(() => {
    getSessions().then(setSessions).catch(() => {})
  }, [activeSessionId])

  const newChat = () => {
    const id = uuidv4()
    router.push(`/chat/${id}`)
  }

  const groups = groupByDate(sessions)

  return (
    <aside
      className="relative flex flex-col h-screen lab-paper border-r-[1.5px] border-lab-ink transition-all duration-300"
      style={{ width: collapsed ? 56 : 240 }}
    >
      {/* red margin line */}
      {!collapsed && (
        <div
          className="absolute top-0 bottom-0 w-px bg-lab-accent opacity-50 pointer-events-none"
          style={{ left: 40 }}
        />
      )}

      {/* Masthead */}
      <div className="px-4 pt-5 pb-4 border-b-[1.5px] border-lab-ink flex items-start justify-between">
        {!collapsed ? (
          <Link href="/" className="block">
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-lab-muted mb-0.5">
              Notebook · Vol. III
            </p>
            <p className="font-serif text-[20px] font-bold tracking-wider text-lab-ink leading-none">
              C·R·U·S·H
            </p>
            <p className="font-hand text-[14px] text-lab-accent mt-1 leading-none">
              entry no. 048
            </p>
          </Link>
        ) : (
          <Link href="/" className="font-serif font-bold text-lg text-lab-ink">C</Link>
        )}
        <button
          onClick={onToggle}
          className="text-lab-muted hover:text-lab-ink transition-colors text-lg leading-none ml-auto"
          aria-label="Toggle sidebar"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* New trial */}
      <div className="px-3 py-3">
        <button
          onClick={newChat}
          className="w-full flex items-center gap-2 px-3 py-2 border-[1.5px] border-lab-ink bg-lab-paper2 hover:bg-lab-highlight/40 transition-colors text-sm text-lab-ink lab-shadow-sm"
        >
          <span className="text-lab-accent text-base leading-none">＋</span>
          {!collapsed && <span className="italic">begin new trial</span>}
        </button>
      </div>

      {/* Index */}
      {!collapsed && (
        <>
          <div className="px-3">
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-lab-muted mb-2 px-1">
              Index
            </p>
            <nav className="flex flex-col gap-1.5 mb-3">
              {[
                { href: '/', num: '§1', label: 'Field log', id: 'landing' },
                { href: '#', num: '§2', label: 'Comparative trial', id: 'chat', muted: true },
                { href: '/benchmark', num: '§3', label: 'Result tables', id: 'dash' },
              ].map((it) => (
                <Link
                  key={it.id}
                  href={it.href}
                  className="flex items-baseline gap-2 px-1 text-[13px] hover:text-lab-accent transition-colors"
                >
                  <span className="font-mono text-[11px] w-6 text-lab-muted">
                    {it.num}
                  </span>
                  <span className={it.muted ? 'text-lab-muted' : 'text-lab-ink'}>
                    {it.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="h-px bg-lab-ink opacity-40 mx-3 mb-3" />

          {/* Recent trials */}
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-lab-muted mb-2 px-1">
              Recent trials
            </p>
            {Object.entries(groups).length === 0 && (
              <p className="font-hand text-[14px] text-lab-muted px-1">
                no trials yet — begin one above ↑
              </p>
            )}
            {Object.entries(groups).map(([label, items]) => (
              <div key={label} className="mb-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-lab-muted mb-1 px-1">
                  {label}
                </p>
                {items.map((s) => (
                  <Link
                    key={s.sessionId}
                    href={`/chat/${s.sessionId}`}
                    className={`block pl-2 pr-2 py-1 text-[12px] truncate transition-all border-l-[1.5px] ${
                      s.sessionId === activeSessionId
                        ? 'border-lab-accent text-lab-ink font-semibold bg-lab-highlight/30'
                        : 'border-lab-ink text-lab-ink/85 hover:text-lab-ink hover:bg-lab-highlight/20'
                    }`}
                  >
                    {s.preview || 'untitled trial'}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Margin note */}
          <div className="px-3 py-3 border-t border-lab-ink/40">
            <p className="font-hand text-[14px] text-lab-accent leading-snug">
              "check seed-3 results before tomorrow's group meeting!"
            </p>
          </div>
        </>
      )}
    </aside>
  )
}
