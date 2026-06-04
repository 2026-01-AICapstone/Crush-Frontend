'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ChatPanel from '@/components/ChatPanel'
import { useLanguage } from '@/components/LanguageContext'
import { sendCompare } from '@/lib/api'
import { Message, PanelMessage } from '@/lib/types'

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const searchParams = useSearchParams()
  const { language } = useLanguage()

  const [baselineMessages, setBaselineMessages] = useState<PanelMessage[]>([])
  const [safetyMessages, setSafetyMessages] = useState<PanelMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'compare' | 'log' | 'analyze'>('compare')

  const [lastRiskScore, setLastRiskScore] = useState(0)
  const [lastInterventionType, setLastInterventionType] = useState('NONE')
  const [lastLayer, setLastLayer] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const didInit = useRef(false)

  const copy = {
    eyebrow: language === 'ko' ? '비교 실험' : 'Comparative trial',
    title: language === 'ko' ? 'Baseline vs CRUSH' : 'Baseline vs CRUSH',
    session: language === 'ko' ? '세션' : 'session',
    newTrial: language === 'ko' ? '새 실험' : '+ new trial',
    tabs: {
      compare: language === 'ko' ? '비교' : 'compare',
      log: language === 'ko' ? '로그' : 'log',
      analyze: language === 'ko' ? '분석' : 'analyze',
    },
    placeholder:
      language === 'ko'
        ? '두 모델에 동시에 보낼 프롬프트를 입력하세요'
        : 'Issue a probe to both arms...',
    submit: language === 'ko' ? '전송' : 'SUBMIT',
    caption:
      language === 'ko'
        ? '왼쪽은 기본 모델, 오른쪽은 CRUSH 안전 개입 결과입니다.'
        : 'Dual-arm comparison: baseline on the left, CRUSH safety intervention on the right.',
    error:
      language === 'ko'
        ? '[응답을 가져오지 못했습니다. FastAPI 서버 상태를 확인하세요.]'
        : '[response error]',
  }

  useEffect(() => {
    if (didInit.current) return
    const first = searchParams.get('first')
    if (first) {
      didInit.current = true
      handleSend(first)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const buildHistory = (msgs: PanelMessage[]): Message[] =>
    msgs.map(({ role, content }) => ({ role, content }))

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')

    const userMsg: PanelMessage = { role: 'user', content: msg }
    setBaselineMessages((prev) => [...prev, userMsg])
    setSafetyMessages((prev) => [...prev, userMsg])

    const history = buildHistory(baselineMessages)
    setLoading(true)

    try {
      const res = await sendCompare(sessionId, msg, history)

      setBaselineMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.baseline.finalResponse },
      ])

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

      setLastRiskScore(res.safety.riskScore)
      setLastInterventionType(res.safety.interventionType)
      setLastLayer(res.safety.detectedLayer)
    } catch {
      setBaselineMessages((prev) => [
        ...prev,
        { role: 'assistant', content: copy.error },
      ])
      setSafetyMessages((prev) => [
        ...prev,
        { role: 'assistant', content: copy.error },
      ])
    } finally {
      setLoading(false)
    }

    inputRef.current?.focus()
  }

  return (
    <div className="flex h-full flex-col overflow-hidden lab-paper">
      <header className="flex shrink-0 flex-col gap-3 border-b-[1.5px] border-lab-ink bg-lab-paper2/70 px-5 py-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
            {copy.eyebrow}
          </p>
          <h2 className="text-[18px] font-bold leading-tight text-lab-ink">
            {copy.title}{' '}
            <span className="ml-1 font-hand text-[18px] font-normal text-lab-accent">
              {copy.session} {sessionId.substring(0, 6)}
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-3 font-mono text-[10px] uppercase tracking-[0.14em]">
            {(['compare', 'log', 'analyze'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-0.5 transition-all ${
                  activeTab === tab
                    ? 'border-b-[1.5px] border-lab-accent text-lab-accent'
                    : 'text-lab-muted hover:text-lab-ink'
                }`}
              >
                {copy.tabs[tab]}
              </button>
            ))}
          </div>
          <Link
            href="/"
            className="border-[1.5px] border-lab-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-lab-ink transition-all hover:bg-lab-highlight/50 lab-shadow-sm"
          >
            {copy.newTrial}
          </Link>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <ChatPanel
          title="Baseline LLM"
          isBaseline
          messages={baselineMessages}
          loading={loading}
        />

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

      <div className="shrink-0 border-t-[1.5px] border-lab-ink bg-lab-paper2/70 px-5 py-3">
        <div className="relative border-[1.5px] border-lab-ink bg-lab-paper lab-shadow-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-lab-accent">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={copy.placeholder}
            className="w-full bg-transparent px-9 py-3 pr-20 text-[14px] text-lab-ink placeholder-lab-muted/70 focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-lab-ink px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-lab-paper transition-colors hover:bg-lab-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copy.submit}
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-lab-muted">
          {copy.caption}
        </p>
      </div>
    </div>
  )
}
