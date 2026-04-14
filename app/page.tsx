'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import Sidebar from '@/components/Sidebar'

const QUICK_ACTIONS = ['CRUSH란 무엇인가요?', '클러스터 탐지는 어떻게 작동하나요?', '비교 시연 시작하기']

export default function LandingPage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [collapsed, setCollapsed] = useState(false)

  const start = (text?: string) => {
    const msg = text ?? input.trim()
    if (!msg) return
    const id = uuidv4()
    router.push(`/chat/${id}?first=${encodeURIComponent(msg)}`)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-crush-purple/5 blur-[120px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-crush-green/5 blur-[80px]" />
        </div>

        <div className="z-10 flex flex-col items-center gap-6 w-full max-w-xl px-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path
                  d="M32 4L8 16v18c0 14 10 26.5 24 30 14-3.5 24-16 24-30V16L32 4z"
                  fill="#39d98a"
                  fillOpacity="0.1"
                  stroke="#39d98a"
                  strokeWidth="1.5"
                />
                <path d="M22 33l7 7 14-14" stroke="#39d98a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-widest text-white">CRUSH</h1>
              <p className="text-xs text-gray-600 tracking-[0.3em] mt-1">CLUSTER-BASED REPELLING UNIT FOR SAFETY & HARMFUL</p>
              <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-gray-700 tracking-widest">
                <span>AI 안전</span>
                <span>·</span>
                <span>비교 출력</span>
                <span>·</span>
                <span>DUAL-MODEL COMPARISON</span>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm leading-relaxed">
            클러스터 기반 유해 콘텐츠 탐지·차단 AI 안전 제어 시스템.<br />
            Baseline LLM과 CRUSH의 응답을 나란히 비교하여<br />
            안전 제어의 실질적 차이를 직접 확인하세요.
          </p>

          {/* Input */}
          <div className="w-full relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && start()}
              placeholder="무엇이든 물어보세요..."
              className="w-full bg-bg-card border border-crush-border rounded-xl px-5 py-4 pr-14 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-crush-purple transition-colors"
            />
            <button
              onClick={() => start()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-crush-purple rounded-lg flex items-center justify-center hover:bg-crush-purple2 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q}
                onClick={() => start(q)}
                className="px-4 py-2 rounded-full border border-crush-border text-xs text-gray-400 hover:text-white hover:border-crush-purple/50 transition-all bg-bg-secondary/50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
