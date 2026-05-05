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
        { role: 'assistant', content: '[response error]' },
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

      <div className="flex-1 flex flex-col overflow-hidden lab-paper">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b-[1.5px] border-lab-ink bg-lab-paper2/60 shrink-0">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-lab-muted">
              Trial · § 2
            </p>
            <h2 className="text-[18px] font-bold text-lab-ink leading-tight">
              Comparative Trial{' '}
              <span className="font-hand text-[18px] font-normal text-lab-accent ml-1">
                — session {sessionId.substring(0, 6)}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-3 font-mono text-[10px] uppercase tracking-[0.14em]">
              {(['compare', 'log', 'analyze'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-0.5 transition-all ${
                    activeTab === tab
                      ? 'text-lab-accent border-b-[1.5px] border-lab-accent'
                      : 'text-lab-muted hover:text-lab-ink'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Link
              href="/"
              className="px-3 py-1.5 border-[1.5px] border-lab-ink text-[11px] text-lab-ink hover:bg-lab-highlight/50 transition-all font-mono uppercase tracking-[0.14em] lab-shadow-sm"
            >
              + new trial
            </Link>
          </div>
        </header>

        {/* Dual panel */}
        <div className="flex-1 grid grid-cols-2 overflow-hidden">
          {/* Control arm */}
          <ChatPanel
            title="Baseline LLM"
            isBaseline={true}
            messages={baselineMessages}
            loading={loading}
          />

          {/* Treatment arm — placeholder */}
          <div className="flex flex-col h-full min-h-0 lab-paper">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-lab-ink bg-lab-paper2/60">
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted">
                  Treatment arm
                </p>
                <h3 className="text-[15px] font-bold text-lab-ink/60 leading-tight">
                  CRUSH
                </h3>
              </div>
              <span className="font-mono text-[10px] text-lab-muted tracking-[0.14em] uppercase">
                pending integration
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center relative">
              {/* taped index card */}
              <div className="relative border-[1.5px] border-lab-ink bg-lab-paper2 px-7 py-6 lab-shadow rotate-[-1deg]">
                <span className="lab-tape" />
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-lab-muted mb-2">
                  Apparatus
                </p>
                <p className="font-serif text-[16px] font-bold text-lab-ink mb-1">
                  M₀ + cluster-repel
                </p>
                <p className="font-hand text-[16px] text-lab-accent">
                  build in progress…
                </p>
              </div>

              <ul className="text-[12.5px] text-lab-ink/85 leading-[1.85] text-left list-disc pl-6">
                <li>input-layer detection</li>
                <li>output-layer detection</li>
                <li>risk scoring (ŝ ∈ [0, 1])</li>
                <li>intervention classifier (NONE / STEER / BLOCK)</li>
              </ul>

              <p className="font-hand text-[16px] text-lab-muted -rotate-[2deg] mt-2">
                comparison panel will appear here once spring service is wired
              </p>
            </div>

            {/* status footer */}
            <div className="px-4 py-2 border-t-[1.5px] border-lab-ink bg-lab-paper2/60 flex items-center gap-4 text-[11px] font-mono">
              <span className="text-lab-muted uppercase tracking-[0.14em]">ŝ</span>
              <span className="text-lab-muted">—</span>
              <span className="text-lab-muted uppercase tracking-[0.14em] ml-2">
                intervene
              </span>
              <span className="text-lab-muted">—</span>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 px-5 py-3 border-t-[1.5px] border-lab-ink bg-lab-paper2/60">
          <div className="relative border-[1.5px] border-lab-ink bg-lab-paper lab-shadow-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-lab-accent">
              {'>'}
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="issue a probe to the baseline…"
              className="w-full bg-transparent px-9 py-3 pr-20 text-[14px] text-lab-ink placeholder-lab-muted/70 focus:outline-none font-serif italic"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-lab-ink text-lab-paper font-mono text-[10px] tracking-[0.16em] hover:bg-lab-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ↵ SUBMIT
            </button>
          </div>
          <p className="text-center text-[11px] italic text-lab-muted mt-2">
            Fig. — control arm active · treatment arm pending integration
          </p>
        </div>
      </div>
    </div>
  )
}
