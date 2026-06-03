'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ChatPanel from '@/components/ChatPanel'
import { sendCompare } from '@/lib/api'
import { Message, PanelMessage } from '@/lib/types'

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const searchParams = useSearchParams()

  const [baselineMessages, setBaselineMessages] = useState<PanelMessage[]>([])
  const [safetyMessages, setSafetyMessages] = useState<PanelMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'compare' | 'log' | 'analyze'>('compare')

  // safety 패널의 마지막 risk 정보
  const [lastRiskScore, setLastRiskScore] = useState(0)
  const [lastInterventionType, setLastInterventionType] = useState('NONE')
  const [lastLayer, setLastLayer] = useState<number | null>(null)

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
    setSafetyMessages((prev) => [...prev, userMsg])

    const history = buildHistory(baselineMessages)
    setLoading(true)

    try {
      const res = await sendCompare(sessionId, msg, history)

      // baseline 패널
      setBaselineMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.baseline.finalResponse },
      ])

      // safety 패널 (risk 정보 포함)
      setSafetyMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.safety.finalResponse,
          riskScore: res.safety.riskScore,
          riskCategory: res.safety.riskCategory,
          detectedLayer: res.safety.detectedLayer,
          interventionTriggered: res.safety.interventionTriggered,
          interventionType: res.safety.interventionType,
        },
      ])

      // 하단 상태바 업데이트
      setLastRiskScore(res.safety.riskScore)
      setLastInterventionType(res.safety.interventionType)
      setLastLayer(res.safety.detectedLayer)
    } catch {
      setBaselineMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '[response error]' },
      ])
      setSafetyMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '[response error]' },
      ])
    } finally {
      setLoading(false)
    }

    inputRef.current?.focus()
  }

  return (
      <div className="flex h-full flex-col overflow-hidden lab-paper">
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
          {/* Control arm — Baseline LLM */}
          <ChatPanel
            title="Baseline LLM"
            isBaseline={true}
            messages={baselineMessages}
            loading={loading}
          />

          {/* Treatment arm — CRUSH */}
          <ChatPanel
            title="CRUSH"
            isBaseline={false}
            messages={safetyMessages}
            loading={loading}
            lastRiskScore={lastRiskScore}
            lastInterventionType={lastInterventionType}
            lastLayer={lastLayer}
          />
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
              placeholder="issue a probe to both arms…"
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
            Fig. — dual-arm comparison · baseline (left) vs CRUSH adapter (right)
          </p>
        </div>
      </div>
  )
}
