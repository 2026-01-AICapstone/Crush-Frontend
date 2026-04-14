export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface PanelMessage extends Message {
  riskScore?: number
  riskCategory?: string
  detectedLayer?: number | null
  interventionTriggered?: boolean
  interventionType?: string
}

export interface ChatApiResponse {
  sessionId: string
  riskScore: number
  riskCategory: string
  detectedLayer: number | null
  interventionTriggered: boolean
  interventionType: string
  finalResponse: string
  processingTimeMs: number
}

export interface SessionSummary {
  sessionId: string
  preview: string
  createdAt: string
}
