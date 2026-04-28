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
  const armLabel = isBaseline ? 'Control arm' : 'Treatment arm'
  const armColor = isBaseline ? 'text-lab-muted' : 'text-lab-accent'
  const sublabel = isBaseline
    ? 'M₀ · 7B-Instruct, no intervention'
    : 'M₀ + cluster-repel'

  return (
    <div className="flex flex-col h-full border-r-[1.5px] border-lab-ink last:border-r-0 lab-paper">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-lab-ink bg-lab-paper2/60">
        <div>
          <p className={`font-mono text-[10px] tracking-[0.16em] uppercase ${armColor}`}>
            {armLabel}
          </p>
          <h3 className="text-[15px] font-bold text-lab-ink leading-tight">
            {title}
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-[10px] text-lab-muted">{sublabel}</span>
          <div className="flex gap-3 text-[10px] text-lab-muted font-mono uppercase tracking-[0.12em] mt-0.5">
            <button className="hover:text-lab-ink transition-colors">print</button>
            <button className="hover:text-lab-ink transition-colors">refresh</button>
            <button className="hover:text-lab-ink transition-colors">code</button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {messages.length === 0 && !loading && (
          <p className="font-hand text-[16px] text-lab-muted text-center mt-12">
            issue a probe below ↓
          </p>
        )}
        {messages.map((msg, i) => (
          <ChatLine key={i} msg={msg} idx={i} isBaseline={isBaseline} />
        ))}

        {loading && (
          <div className="lab-fade-in">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-lab-muted">
                Awaiting response…
              </span>
              <div className="flex-1 h-px bg-lab-ink opacity-50" />
            </div>
            <span className="inline-flex gap-1 items-center pt-1">
              <span className="w-1.5 h-1.5 bg-lab-ink rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-lab-ink rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-lab-ink rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
        )}
      </div>

      {/* Status footer */}
      <div className="px-4 py-2 border-t-[1.5px] border-lab-ink bg-lab-paper2/60 flex items-center gap-4 text-[11px] font-mono">
        <span className="text-lab-muted uppercase tracking-[0.14em]">ŝ</span>
        <span
          className={
            isBaseline
              ? 'text-lab-muted'
              : lastRiskScore >= 0.7
              ? 'text-risk-high font-bold'
              : lastRiskScore >= 0.4
              ? 'text-risk-mid font-bold'
              : 'text-risk-low'
          }
        >
          {isBaseline ? '—' : lastRiskScore.toFixed(2)}
        </span>

        <span className="text-lab-muted uppercase tracking-[0.14em] ml-2">
          intervene
        </span>
        <span
          className={
            isBaseline
              ? 'text-lab-muted'
              : lastInterventionType === 'BLOCK'
              ? 'text-risk-high font-bold'
              : lastInterventionType === 'NONE'
              ? 'text-lab-muted'
              : 'text-risk-mid font-bold'
          }
        >
          {isBaseline ? 'NONE' : lastInterventionType}
        </span>

        {!isBaseline && lastLayer != null && (
          <>
            <span className="text-lab-muted uppercase tracking-[0.14em] ml-2">ℓ</span>
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
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-lab-muted">
            Q{String(Math.floor(idx / 2) + 1).padStart(2, '0')} · prompt
          </span>
          <div className="flex-1 h-px bg-lab-ink opacity-50" />
        </div>
        <p className="text-[14px] leading-[1.55] italic text-lab-ink">
          “{msg.content}”
        </p>
      </div>
    )
  }

  return (
    <div className="lab-fade-in relative">
      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-lab-muted">
          A{String(Math.floor(idx / 2) + 1).padStart(2, '0')} · response
        </span>
        {!isBaseline && msg.riskScore != null && (
          <>
            <span className="font-mono text-[10px] text-lab-accent tracking-[0.1em]">
              ŝ = {msg.riskScore.toFixed(2)}
            </span>
            {msg.detectedLayer != null && (
              <span className="font-mono text-[10px] text-lab-muted tracking-[0.1em]">
                ℓ = {msg.detectedLayer}
              </span>
            )}
            {msg.interventionType && msg.interventionType !== 'NONE' && (
              <span className="font-mono text-[10px] text-lab-muted tracking-[0.1em]">
                · {msg.interventionType}
              </span>
            )}
          </>
        )}
        <div className="flex-1 h-px bg-lab-ink opacity-50 min-w-[20px]" />
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

      <p
        className="text-[14px] leading-[1.65] text-lab-ink whitespace-pre-wrap"
        style={{ textAlign: 'justify', hyphens: 'auto' }}
      >
        {msg.content}
      </p>
    </div>
  )
}
