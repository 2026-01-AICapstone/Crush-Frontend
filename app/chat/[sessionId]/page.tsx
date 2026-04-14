'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import ChatPanel from '@/components/ChatPanel'
import { sendChat } from '@/lib/api'
import { Message, PanelMessage } from '@/lib/types'

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const searchParams = useSearchParams()

  const [baselineMessages, setBaselineMessages] = useState<PanelMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'compare' | 'log' | 'analyze'>('compare')

  const inputRef = useRef<HTMLInputElement>(null)
  const didInit = useRef(false)

  // Handle first message from landing page
  useEffect(() => {
    if (didInit.current) return
    const first = searchParams.get('first')
    if (first) {
      didInit.current = true
      handleSend(first)
    }
  }, [])

  const buildHistory = (msgs: PanelMessage[]): Message[] =>
    msgs.map(({ role, content }) => ({ role, content }))

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')

    const userMsg: PanelMessage = { role: 'user', content: msg }
    setBaselineMessages((prev) => [...prev, userMsg])

    const history = buildHistory(baselineMessages)
    setLoading(true)

    try {
      const res = await sendChat(sessionId, msg, history)
      setBaselineMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.finalResponse },
      ])
    } catch {
      setBaselineMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '[응답 오류]' },
      ])
    } finally {
      setLoading(false)
    }

    inputRef.current?.focus()
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeSessionId={sessionId}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-crush-border bg-bg-secondary/50 shrink-0">
          <div className="flex items-center gap-1">
            {(['compare', 'log', 'analyze'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-bg-hover text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab === 'compare' ? '비교' : tab === 'log' ? '로그' : '분석'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="truncate max-w-[200px]">{sessionId.substring(0, 8)}...</span>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg border border-crush-border hover:border-crush-purple text-gray-400 hover:text-white transition-all"
            >
              + 새 대화
            </Link>
          </div>
        </header>

        {/* Dual panel */}
        <div className="flex-1 grid grid-cols-2 overflow-hidden">
          {/* Baseline panel */}
          <ChatPanel
            title="Baseline LLM"
            isBaseline={true}
            messages={baselineMessages}
            loading={loading}
          />

          {/* CRUSH panel — 구현 예정 */}
          <div className="flex flex-col h-full border-l border-crush-border">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-crush-border bg-bg-secondary/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-crush-purple/40" />
                <span className="text-sm font-semibold text-crush-purple/50">CRUSH</span>
              </div>
              <span className="text-xs text-gray-700 tracking-widest">COMING SOON</span>
            </div>

            {/* Placeholder body */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
              {/* Shield icon */}
              <svg width="56" height="56" viewBox="0 0 64 64" fill="none" className="opacity-20">
                <path
                  d="M32 4L8 16v18c0 14 10 26.5 24 30 14-3.5 24-16 24-30V16L32 4z"
                  fill="#8b5cf6"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                />
                <path d="M22 33l7 7 14-14" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">CRUSH 안전 모델</p>
                <p className="text-xs text-gray-700 leading-relaxed max-w-[240px]">
                  클러스터 기반 유해 콘텐츠 탐지·차단 기능은<br />
                  현재 구현 중입니다.
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                {['입력 레이어 탐지', '출력 레이어 탐지', '위험도 스코어링', '개입 유형 분류'].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary/50 border border-crush-border/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700 shrink-0" />
                    <span className="text-xs text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Bar */}
            <div className="px-4 py-2 border-t border-crush-border bg-bg-secondary/30 flex items-center gap-4 text-xs font-mono">
              <span className="text-gray-700">RISK SCORE</span>
              <span className="text-gray-700">—</span>
              <span className="text-gray-700 ml-2">INTERVENTION</span>
              <span className="text-gray-700">—</span>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 px-4 py-3 border-t border-crush-border bg-bg-secondary/30">
          <div className="relative">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Baseline LLM에 메시지를 보내세요..."
              className="w-full bg-bg-card border border-crush-border rounded-xl px-5 py-3.5 pr-14 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-crush-purple transition-colors"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-crush-purple rounded-lg flex items-center justify-center hover:bg-crush-purple2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-700 mt-2">
            Baseline LLM 전송 중 · CRUSH 안전 모델 연동 준비 중
          </p>
        </div>
      </div>
    </div>
  )
}
