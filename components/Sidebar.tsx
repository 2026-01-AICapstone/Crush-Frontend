'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { useLanguage } from '@/components/LanguageContext'
import { getSessions } from '@/lib/api'
import { SessionSummary } from '@/lib/types'

interface Props {
  collapsed?: boolean
  onToggle?: () => void
  activeSessionId?: string
}

function groupByDate(sessions: SessionSummary[], language: 'en' | 'ko') {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const groups: Record<string, SessionSummary[]> = {}
  sessions.forEach((session) => {
    const date = new Date(session.createdAt)
    let label: string
    if (date.toDateString() === today.toDateString()) label = language === 'ko' ? '오늘' : 'Today'
    else if (date.toDateString() === yesterday.toDateString()) label = language === 'ko' ? '어제' : 'Yesterday'
    else {
      label = date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
    if (!groups[label]) groups[label] = []
    groups[label].push(session)
  })
  return groups
}

export default function Sidebar({ collapsed = false, onToggle, activeSessionId }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const [sessions, setSessions] = useState<SessionSummary[]>([])

  useEffect(() => {
    let mounted = true
    getSessions()
      .then((nextSessions) => {
        if (mounted) setSessions(nextSessions)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const newChat = () => {
    const id = uuidv4()
    router.push(`/chat/${id}`)
  }

  const copy = {
    notebook: language === 'ko' ? '실험 노트 · Vol. III' : 'Notebook · Vol. III',
    entry: language === 'ko' ? '기록 048' : 'entry no. 048',
    newTrial: language === 'ko' ? '새 비교 실험' : 'begin new trial',
    index: language === 'ko' ? '메뉴' : 'Index',
    recent: language === 'ko' ? '최근 대화' : 'Recent trials',
    empty: language === 'ko' ? '아직 기록이 없습니다. 새 비교 실험을 시작해 보세요.' : 'no trials yet - begin one above',
    untitled: language === 'ko' ? '제목 없는 대화' : 'untitled trial',
    note:
      language === 'ko'
        ? '기본 모델과 CRUSH 적용 결과를 나란히 비교합니다.'
        : '"check seed-3 results before tomorrow\'s group meeting!"',
  }

  const navItems = [
    { href: '/', num: 'No.1', label: language === 'ko' ? '개요' : 'Home', id: 'landing' },
    {
      href: '#',
      num: 'No.2',
      label: language === 'ko' ? '비교 실험' : 'Comparative trial',
      id: 'chat',
      muted: true,
    },
    {
      href: '/latent',
      num: 'No.3',
      label: language === 'ko' ? '잠재 공간' : 'Latent space',
      id: 'latent',
    },
  ]
  const groups = groupByDate(sessions, language)

  return (
    <aside
      className="relative z-10 flex h-screen flex-col border-r-[1.5px] border-lab-ink lab-paper transition-all duration-300"
      style={{ width: collapsed ? 56 : 240 }}
    >
      <div className="flex items-start justify-between border-b-[1.5px] border-lab-ink px-4 pb-4 pt-5">
        {!collapsed ? (
          <Link href="/" className="block">
            <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-lab-muted">
              {copy.notebook}
            </p>
            <p className="font-serif text-[20px] font-bold leading-none tracking-wider text-lab-ink">
              C.R.U.S.H
            </p>
            <p className="mt-1 font-hand text-[14px] leading-none text-lab-accent">{copy.entry}</p>
          </Link>
        ) : (
          <Link href="/" className="font-serif text-lg font-bold text-lab-ink">
            C
          </Link>
        )}
        <button
          onClick={onToggle}
          className="ml-auto flex h-7 w-7 items-center justify-center border border-transparent text-lg leading-none text-lab-muted transition-colors hover:border-lab-ink hover:text-lab-ink"
          aria-label="Toggle sidebar"
        >
          {collapsed ? '>' : '<'}
        </button>
      </div>

      <div className="px-3 pt-3">
        <div className="grid grid-cols-2 border-[1.5px] border-lab-ink bg-lab-paper2 font-mono text-[10px] uppercase tracking-[0.14em]">
          {(['ko', 'en'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLanguage(option)}
              className={`px-2 py-1.5 transition-colors ${
                language === option ? 'bg-lab-ink text-lab-paper' : 'text-lab-ink hover:bg-lab-highlight/40'
              }`}
              aria-pressed={language === option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-3">
        <button
          onClick={newChat}
          className="flex w-full items-center gap-2 border-[1.5px] border-lab-ink bg-lab-paper2 px-3 py-2 text-sm text-lab-ink transition-colors hover:bg-lab-highlight/40 focus:outline-none focus:ring-2 focus:ring-lab-accent/30 lab-shadow-sm"
        >
          <span className="text-base leading-none text-lab-accent">+</span>
          {!collapsed && <span className="italic">{copy.newTrial}</span>}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="px-3">
            <p className="mb-2 px-1 font-mono text-[9px] uppercase tracking-[0.22em] text-lab-muted">
              {copy.index}
            </p>
            <nav className="mb-3 flex flex-col gap-1.5">
              {navItems.map((item) => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : item.href !== '#' && pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-baseline gap-2 border-l-[1.5px] px-1 py-0.5 text-[13px] transition-colors ${
                      active
                        ? 'border-lab-accent bg-lab-highlight/30 font-semibold text-lab-ink'
                        : 'border-transparent hover:text-lab-accent'
                    }`}
                  >
                    <span className={`w-6 font-mono text-[11px] ${active ? 'text-lab-accent' : 'text-lab-muted'}`}>
                      {item.num}
                    </span>
                    <span className={item.muted ? 'text-lab-muted' : 'text-lab-ink'}>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="mx-3 mb-3 h-px bg-lab-ink opacity-40" />

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <p className="mb-2 px-1 font-mono text-[9px] uppercase tracking-[0.22em] text-lab-muted">
              {copy.recent}
            </p>
            {Object.entries(groups).length === 0 && (
              <p className="px-1 font-hand text-[14px] text-lab-muted">{copy.empty}</p>
            )}
            {Object.entries(groups).map(([label, items]) => (
              <div key={label} className="mb-3">
                <p className="mb-1 px-1 font-mono text-[9px] uppercase tracking-[0.18em] text-lab-muted">
                  {label}
                </p>
                {items.map((session) => (
                  <Link
                    key={session.sessionId}
                    href={`/chat/${session.sessionId}`}
                    className={`block truncate border-l-[1.5px] py-1 pl-2 pr-2 text-[12px] transition-all ${
                      session.sessionId === activeSessionId
                        ? 'border-lab-accent bg-lab-highlight/30 font-semibold text-lab-ink'
                        : 'border-lab-ink text-lab-ink/85 hover:bg-lab-highlight/20 hover:text-lab-ink'
                    }`}
                  >
                    {session.preview || copy.untitled}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-lab-ink/40 px-3 py-3">
            <p className="font-hand text-[14px] leading-snug text-lab-accent">{copy.note}</p>
          </div>
        </>
      )}
    </aside>
  )
}


