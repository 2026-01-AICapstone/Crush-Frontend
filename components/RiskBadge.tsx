interface Props {
  riskScore: number
  riskCategory: string
  interventionType: string
  detectedLayer?: number | null
}

export default function RiskBadge({ riskScore, riskCategory, interventionType, detectedLayer }: Props) {
  const color =
    riskScore >= 0.7 ? 'text-risk-high border-risk-high bg-red-900/20' :
    riskScore >= 0.4 ? 'text-risk-mid border-risk-mid bg-yellow-900/20' :
                       'text-risk-low border-risk-low bg-green-900/20'

  const label = riskCategory
    ? riskCategory.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Unknown'

  return (
    <div className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded border ${color} font-mono mb-2`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>이상 감지 — {label}</span>
      {detectedLayer != null && <span className="opacity-60">Layer {detectedLayer}</span>}
      {interventionType !== 'NONE' && (
        <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-current/10 font-bold">
          {interventionType}
        </span>
      )}
    </div>
  )
}
