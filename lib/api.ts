import { ChatApiResponse, CompareApiResponse, Message, SessionSummary } from './types'

const BASE = '/api'
let sessionsCache: SessionSummary[] | null = null
let sessionsRequest: Promise<SessionSummary[]> | null = null

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
  return parseChatResponse(raw)
}

function parseChatResponse(raw: Record<string, unknown>): ChatApiResponse {
  return {
    sessionId: (raw.session_id ?? raw.sessionId) as string,
    riskScore: (raw.risk_score ?? raw.riskScore ?? 0) as number,
    riskCategory: (raw.risk_category ?? raw.riskCategory ?? '') as string,
    detectedLayer: (raw.detected_layer ?? raw.detectedLayer ?? null) as number | null,
    interventionTriggered: (raw.intervention_triggered ?? raw.interventionTriggered ?? false) as boolean,
    interventionType: (raw.intervention_type ?? raw.interventionType ?? 'NONE') as string,
    finalResponse: (raw.final_response ?? raw.finalResponse ?? '') as string,
    processingTimeMs: (raw.processing_time_ms ?? raw.processingTimeMs ?? 0) as number,
  }
}

export async function sendCompare(
  sessionId: string,
  userMessage: string,
  history: Message[]
): Promise<CompareApiResponse> {
  const res = await fetch(`${BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      userMessage,
      conversationHistory: history,
      mode: 'compare',
    }),
  })
  if (!res.ok) throw new Error(`Compare API error: ${res.status}`)
  const raw = await res.json()
  return {
    sessionId: raw.session_id ?? raw.sessionId,
    baseline: parseChatResponse(raw.baseline),
    safety: parseChatResponse(raw.safety),
    processingTimeMs: raw.processing_time_ms ?? raw.processingTimeMs ?? 0,
  }
}

export async function getSessions(): Promise<SessionSummary[]> {
  if (sessionsCache) return sessionsCache
  if (sessionsRequest) return sessionsRequest

  const signal =
    typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
      ? AbortSignal.timeout(1500)
      : undefined

  sessionsRequest = fetch(`${BASE}/sessions`, { signal })
    .then((res) => {
      if (!res.ok) throw new Error(`Sessions API error: ${res.status}`)
      return res.json() as Promise<SessionSummary[]>
    })
    .then((sessions) => {
      sessionsCache = sessions
      return sessions
    })
    .finally(() => {
      sessionsRequest = null
    })

  return sessionsRequest
}
