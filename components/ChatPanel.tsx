import { useLanguage } from '@/components/LanguageContext'
import { PanelMessage } from '@/lib/types'
import RiskBadge from './RiskBadge'

interface Props {
  title: string
  isBaseline: boolean
  messages: PanelMessage[]
  loading: boolean
  lastRiskScore?: number
  lastInterventionType?: string
  lastLayer?: number | null
}

export default function ChatPanel({
  title,
  isBaseline,
  messages,
  loading,
  lastRiskScore = 0,
  lastInterventionType = 'NONE',
  lastLayer,
}: Props) {
  const { language } = useLanguage()
  const armLabel = isBaseline
    ? language === 'ko' ? '기준 모델' : 'Control arm'
    : language === 'ko' ? 'CRUSH 적용' : 'Treatment arm'
  const armColor = isBaseline ? 'text-lab-muted' : 'text-lab-accent'
  const sublabel = isBaseline
    ? language === 'ko' ? '안전 개입 없음 · prefix attack' : 'no intervention · prefix attack'
    : language === 'ko' ? 'CRUSH 안전 개입 · cluster guardrail' : 'CRUSH intervention · cluster guardrail'
  const emptyText = language === 'ko'
    ? '아래에 프롬프트를 입력하면 두 모델을 나란히 비교합니다.'
    : 'Issue a probe below to compare both arms.'
  const loadingText = language === 'ko' ? '응답 생성 중' : 'Awaiting response'

  return (
    <div className="flex h-full min-h-0 flex-col border-r-[1.5px] border-lab-ink last:border-r-0 lab-paper">
      <div className="flex items-start justify-between gap-3 border-b border-lab-ink bg-lab-paper2/70 px-4 py-3">
        <div className="min-w-0">
          <p className={`font-mono text-[10px] uppercase tracking-[0.16em] ${armColor}`}>
            {armLabel}
          </p>
          <h3 className="truncate text-[16px] font-bold leading-tight text-lab-ink">
            {title}
          </h3>
        </div>
        <div className="min-w-[150px] text-right">
          <span className="font-mono text-[10px] text-lab-muted">{sublabel}</span>
          <div className="mt-1 flex justify-end gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-lab-muted">
            <span>{isBaseline ? 'OFF' : 'ON'}</span>
            <span>500 tok</span>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {messages.length === 0 && !loading && (
          <p className="mx-auto mt-12 max-w-xs text-center text-[14px] leading-relaxed text-lab-muted">
            {emptyText}
          </p>
        )}

        <div className="space-y-5">
          {messages.map((msg, i) => (
            <ChatLine key={i} msg={msg} idx={i} isBaseline={isBaseline} />
          ))}
        </div>

        {loading && (
          <div className="mt-5 lab-fade-in">
            <div className="mb-1 flex items-baseline gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
                {loadingText}
              </span>
              <div className="h-px flex-1 bg-lab-ink opacity-50" />
            </div>
            <span className="inline-flex items-center gap-1 pt-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lab-ink [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lab-ink [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lab-ink [animation-delay:300ms]" />
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t-[1.5px] border-lab-ink bg-lab-paper2/70 px-4 py-2 font-mono text-[11px]">
        <span className="text-lab-muted uppercase tracking-[0.14em]">risk</span>
        <span
          className={
            isBaseline
              ? 'text-lab-muted'
              : lastRiskScore >= 0.7
              ? 'font-bold text-risk-high'
              : lastRiskScore >= 0.4
              ? 'font-bold text-risk-mid'
              : 'text-risk-low'
          }
        >
          {isBaseline ? '-' : lastRiskScore.toFixed(2)}
        </span>

        <span className="text-lab-muted uppercase tracking-[0.14em]">action</span>
        <span
          className={
            isBaseline
              ? 'text-lab-muted'
              : lastInterventionType === 'BLOCK'
              ? 'font-bold text-risk-high'
              : lastInterventionType === 'NONE'
              ? 'text-lab-muted'
              : 'font-bold text-risk-mid'
          }
        >
          {isBaseline ? 'NONE' : lastInterventionType}
        </span>

        {!isBaseline && lastLayer != null && (
          <>
            <span className="text-lab-muted uppercase tracking-[0.14em]">layer</span>
            <span className="text-lab-accent">{lastLayer}</span>
          </>
        )}
      </div>
    </div>
  )
}

function ChatLine({
  msg,
  idx,
  isBaseline,
}: {
  msg: PanelMessage
  idx: number
  isBaseline: boolean
}) {
  if (msg.role === 'user') {
    return (
      <div className="lab-fade-in">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
            Q{String(Math.floor(idx / 2) + 1).padStart(2, '0')} · prompt
          </span>
          <div className="h-px flex-1 bg-lab-ink opacity-50" />
        </div>
        <p className="rounded-sm bg-lab-highlight/25 px-3 py-2 text-[14px] leading-[1.6] text-lab-ink">
          {msg.content}
        </p>
      </div>
    )
  }

  return (
    <div className="relative lab-fade-in">
      <div className="mb-1 flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
          A{String(Math.floor(idx / 2) + 1).padStart(2, '0')} · response
        </span>
        {!isBaseline && msg.riskScore != null && (
          <>
            <span className="font-mono text-[10px] tracking-[0.1em] text-lab-accent">
              risk {msg.riskScore.toFixed(2)}
            </span>
            {msg.detectedLayer != null && (
              <span className="font-mono text-[10px] tracking-[0.1em] text-lab-muted">
                L= {msg.detectedLayer}
              </span>
            )}
            {msg.interventionType && msg.interventionType !== 'NONE' && (
              <span className="font-mono text-[10px] tracking-[0.1em] text-lab-muted">
                · {msg.interventionType}
              </span>
            )}
          </>
        )}
        <div className="h-px min-w-[20px] flex-1 bg-lab-ink opacity-50" />
      </div>

      {!isBaseline &&
        msg.riskScore != null &&
        msg.riskScore > 0.1 && (
          <RiskBadge
            riskScore={msg.riskScore}
            riskCategory={msg.riskCategory || ''}
            interventionType={msg.interventionType || 'NONE'}
            detectedLayer={msg.detectedLayer}
          />
        )}

      <p className="whitespace-pre-wrap text-[14px] leading-[1.7] text-lab-ink">
        {msg.content}
      </p>
    </div>
  )
}
