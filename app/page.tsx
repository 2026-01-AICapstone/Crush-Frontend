'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import Sidebar from '@/components/Sidebar'

const QUICK_ACTIONS = [
  'What is CRUSH?',
  'How does cluster-level detection work?',
  'Begin a comparative trial',
]

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

      <main className="flex-1 overflow-y-auto lab-paper relative">
        {/* page corner stamp */}
        <div className="absolute top-6 right-10 font-mono text-[11px] tracking-[0.18em] text-lab-muted text-right leading-relaxed">
          DATE 2026-04-28
          <br />
          PAGE 1 / 18
        </div>

        {/* red margin line */}
        <div
          className="absolute top-0 bottom-0 w-px bg-lab-accent opacity-40 pointer-events-none"
          style={{ left: 130 }}
        />

        <div className="max-w-[760px] pl-[170px] pr-12 pt-20 pb-16">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-lab-accent mb-2">
            Experiment 048
          </p>

          <h1 className="text-[40px] font-bold leading-[1.1] tracking-tight text-lab-ink mb-4 text-balance">
            CRUSH: Cluster-based Repelling Units
            <br />
            for Safety against Harmful Generation
          </h1>

          <p className="font-hand text-[24px] text-lab-accent mb-7 inline-block -rotate-[1deg]">
            "does cluster-repel actually work?" ← RQ
          </p>

          {/* Hypothesis */}
          <section className="mb-8">
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-lab-muted mb-2">
              Hypothesis (H₁)
            </p>
            <p className="text-[15.5px] leading-[1.65] text-lab-ink text-justify hyphens-auto">
              Hidden states of harmful trajectories form{' '}
              <span className="lab-underline">cluster-separable manifolds</span> at
              intermediate transformer layers. Projecting decoding states{' '}
              <em>away</em> from these centroids should suppress harmful
              continuations while preserving benign capability — measured as a drop
              in <strong>Attack Success Rate</strong> with negligible regression on
              MMLU / TruthfulQA.
            </p>
          </section>

          {/* Materials */}
          <section className="relative border-[1.5px] border-lab-ink bg-lab-paper2/80 px-5 py-4 mb-8 lab-shadow">
            <span className="absolute -top-3 right-4 font-mono text-[9px] tracking-[0.18em] px-2 py-[3px] bg-lab-accent text-lab-paper rotate-[2deg] inline-block">
              IRB-APPROVED
            </span>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-lab-muted mb-2">
              Materials
            </p>
            <ul className="pl-5 text-[14px] leading-[1.85] list-disc text-lab-ink">
              <li>Base model: Llama-2-7B-Instruct (frozen)</li>
              <li>Cluster set: 8 centroids, k-means @ ℓ = 14</li>
              <li>Eval suites: WildGuardTest, ProfBing, GCG, AutoDAN, RAP, OOD</li>
              <li>Seeds: {`{1, 7, 42}`}</li>
            </ul>
          </section>

          {/* Probe input */}
          <section className="mb-6">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-lab-muted mb-2">
              §1.2 issue a probe
            </p>
            <div className="relative border-[1.5px] border-lab-ink bg-lab-paper2 lab-shadow">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && start()}
                placeholder="ask anything…"
                className="w-full bg-transparent px-4 py-3.5 pr-14 text-[15px] text-lab-ink placeholder-lab-muted/70 focus:outline-none font-serif italic"
              />
              <button
                onClick={() => start()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-lab-ink text-lab-paper font-mono text-[10px] tracking-[0.16em] hover:bg-lab-accent transition-colors lab-shadow-sm"
              >
                SUBMIT ↵
              </button>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => start(q)}
                  className="px-3 py-1.5 border-[1.5px] border-lab-ink text-[12px] text-lab-ink hover:bg-lab-highlight/50 transition-colors italic font-serif lab-shadow-sm bg-lab-paper2"
                >
                  {q}
                </button>
              ))}
            </div>
          </section>

          {/* CTA row */}
          <div className="flex items-center gap-4 mb-12">
            <span className="font-hand text-[20px] text-lab-accent -rotate-[3deg] inline-block">
              ↑ start here!
            </span>
          </div>

          {/* Footnote */}
          <div className="pt-2 border-t border-lab-ink/60 text-[11px] italic text-lab-muted flex justify-between">
            <span>
              Witnessed by: A. Reviewer (initials: AR) · Apr 28, 2026
            </span>
            <span>cf. notebook vol. II, pp. 102–110</span>
          </div>
        </div>
      </main>
    </div>
  )
}
