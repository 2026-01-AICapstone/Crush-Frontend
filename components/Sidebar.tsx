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
    if (d.toDateString() === today.toDateString()) label = '오늘'
    else if (d.toDateString() === yesterday.toDateString()) label = '어제'
    else label = `${d.getMonth() + 1}월 ${d.getDate()}일`
    if (!groups[label]) groups[label] = []
    groups[label].push(s)
  })
  return groups
}

export default function Sidebar({ collapsed = false, onToggle, activeSessionId }: Props) {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionSummary[]>([])

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(() => {})
  }, [activeSessionId])

  const newChat = () => {
    const id = uuidv4()
    router.push(`/chat/${id}`)
  }

  const groups = groupByDate(sessions)

  return (
    <aside
      className="flex flex-col h-screen bg-bg-secondary border-r border-crush-border transition-all duration-300"
      style={{ width: collapsed ? 56 : 220 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-crush-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <CrushIcon />
            <span className="font-bold text-base tracking-wider text-white">CRUSH</span>
          </Link>
        )}
        {collapsed && <CrushIcon />}
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-white transition-colors ml-auto"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 py-3">
        <button
          onClick={newChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-crush-border hover:border-crush-purple hover:bg-bg-hover transition-all text-sm text-gray-300 hover:text-white"
        >
          <span className="text-crush-purple text-lg leading-none">+</span>
          {!collapsed && <span>새 대화 시작</span>}
        </button>
      </div>

      {/* Session List */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
          {Object.entries(groups).map(([label, items]) => (
            <div key={label}>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-1 px-1">{label}</p>
              {items.map((s) => (
                <Link
                  key={s.sessionId}
                  href={`/chat/${s.sessionId}`}
                  className={`block px-3 py-2 rounded-lg text-sm truncate transition-all ${
                    s.sessionId === activeSessionId
                      ? 'bg-bg-hover text-white border-l-2 border-crush-purple'
                      : 'text-gray-400 hover:text-white hover:bg-bg-hover'
                  }`}
                >
                  {s.preview || '새 대화'}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Benchmark Link */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-crush-border">
          <Link
            href="/benchmark"
            className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-bg-hover transition-all"
          >
            성능 대시보드
          </Link>
        </div>
      )}
    </aside>
  )
}

function CrushIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6L12 2z"
        fill="#39d98a"
        fillOpacity="0.15"
        stroke="#39d98a"
        strokeWidth="1.5"
      />
      <path d="M9 12l2 2 4-4" stroke="#39d98a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
