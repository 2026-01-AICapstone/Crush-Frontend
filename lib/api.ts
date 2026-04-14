import { ChatApiResponse, Message, SessionSummary } from './types'

const BASE = '/api'

export async function sendChat(
  sessionId: string,
  userMessage: string,
  history: Message[]
): Promise<ChatApiResponse> {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      userMessage,
      conversationHistory: history,
      mode: 'baseline',
    }),
  })
  if (!res.ok) throw new Error(`Chat API error: ${res.status}`)
  const raw = await res.json()
  return {
    sessionId: raw.session_id ?? raw.sessionId,
    riskScore: raw.risk_score ?? raw.riskScore ?? 0,
    riskCategory: raw.risk_category ?? raw.riskCategory ?? '',
    detectedLayer: raw.detected_layer ?? raw.detectedLayer ?? null,
    interventionTriggered: raw.intervention_triggered ?? raw.interventionTriggered ?? false,
    interventionType: raw.intervention_type ?? raw.interventionType ?? 'NONE',
    finalResponse: raw.final_response ?? raw.finalResponse ?? '',
    processingTimeMs: raw.processing_time_ms ?? raw.processingTimeMs ?? 0,
  }
}

export async function getSessions(): Promise<SessionSummary[]> {
  const res = await fetch(`${BASE}/sessions`)
  if (!res.ok) throw new Error(`Sessions API error: ${res.status}`)
  return res.json()
}
