interface Props {
  riskScore: number
  riskCategory: string
  interventionType: string
  detectedLayer?: number | null
}

export default function RiskBadge({
  riskScore,
  riskCategory,
  interventionType,
  detectedLayer,
}: Props) {
  const tone =
    riskScore >= 0.7
      ? 'border-risk-high text-risk-high bg-risk-high/10'
      : riskScore >= 0.4
      ? 'border-risk-mid text-risk-mid bg-risk-mid/10'
      : 'border-risk-low text-risk-low bg-risk-low/10'

  const label = riskCategory
    ? riskCategory.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Unknown'

  return (
    <div
      className={`inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] px-2 py-[3px] border-[1.5px] ${tone} mb-2 lab-shadow-sm`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current lab-blink" />
      <span>anomaly · {label}</span>
      {detectedLayer != null && (
        <span className="opacity-70">ℓ = {detectedLayer}</span>
      )}
      {interventionType !== 'NONE' && (
        <span className="ml-1 px-1.5 py-[1px] bg-current/15 font-bold">
          {interventionType}
        </span>
      )}
    </div>
  )
}
