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
  const accentColor = isBaseline ? 'text-gray-400' : 'text-crush-purple'
  const dotColor = isBaseline ? 'bg-gray-500' : 'bg-crush-purple'

  return (
    <div className="flex flex-col h-full border-r border-crush-border last:border-r-0">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-crush-border bg-bg-secondary/50">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span className={`text-sm font-semibold ${accentColor}`}>{title}</span>
        </div>
        <div className="flex gap-3 text-xs text-gray-600">
          <button className="hover:text-gray-300 transition-colors">인쇄</button>
          <button className="hover:text-gray-300 transition-colors">새로고침</button>
          <button className="hover:text-gray-300 transition-colors">코드</button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              {/* Risk badge for AI messages */}
              {msg.role === 'assistant' && !isBaseline && msg.riskScore != null && msg.riskScore > 0.1 && (
                <RiskBadge
                  riskScore={msg.riskScore}
                  riskCategory={msg.riskCategory || ''}
                  interventionType={msg.interventionType || 'NONE'}
                  detectedLayer={msg.detectedLayer}
                />
              )}

              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-bg-hover text-white rounded-tr-sm'
                    : isBaseline
                    ? 'bg-bg-card text-gray-200 rounded-tl-sm'
                    : 'bg-crush-purple/10 border border-crush-purple/20 text-gray-200 rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start fade-in">
            <div className="px-4 py-3 rounded-2xl bg-bg-card text-gray-500 text-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-crush-border bg-bg-secondary/30 flex items-center gap-4 text-xs font-mono">
        <span className="text-gray-600">RISK SCORE</span>
        <span className={
          lastRiskScore >= 0.7 ? 'text-risk-high font-bold' :
          lastRiskScore >= 0.4 ? 'text-risk-mid font-bold' :
          'text-risk-low'
        }>
          {isBaseline ? '—' : lastRiskScore.toFixed(2)}
        </span>

        <span className="text-gray-600 ml-2">INTERVENTION</span>
        <span className={
          lastInterventionType === 'BLOCK' ? 'text-risk-high font-bold' :
          lastInterventionType === 'NONE' ? 'text-gray-500' :
          'text-risk-mid font-bold'
        }>
          {isBaseline ? 'NONE' : lastInterventionType}
        </span>

        {!isBaseline && lastLayer != null && (
          <>
            <span className="text-gray-600 ml-2">LAYER</span>
            <span className="text-crush-purple">{lastLayer}</span>
          </>
        )}
      </div>
    </div>
  )
}
