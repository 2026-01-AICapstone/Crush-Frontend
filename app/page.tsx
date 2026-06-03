'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { useLanguage } from '@/components/LanguageContext'

export default function LandingPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [input, setInput] = useState('')

  const copy = useMemo(
    () => ({
      eyebrow: language === 'ko' ? '실험 048' : 'Experiment 048',
      title:
        language === 'ko'
          ? 'CRUSH: 유해 생성 방지를 위한 클러스터 기반 반발 유닛'
          : 'CRUSH: Cluster-based Repelling Units for Safety against Harmful Generation',
      note: language === 'ko' ? '"cluster-repel은 실제로 작동하는가?" - RQ' : '"does cluster-repel actually work?" - RQ',
      hypothesisLabel: language === 'ko' ? '가설 (H1)' : 'Hypothesis (H1)',
      hypothesis:
        language === 'ko'
          ? '유해 궤적의 hidden state는 중간 transformer layer에서 클러스터로 분리 가능한 매니폴드를 형성합니다. 디코딩 상태를 이 중심점에서 멀어지게 투영하면 일반 능력 저하는 거의 없이 Attack Success Rate를 낮출 수 있습니다.'
          : 'Hidden states of harmful trajectories form cluster-separable manifolds at intermediate transformer layers. Projecting decoding states away from these centroids should suppress harmful continuations while preserving benign capability, measured as a drop in Attack Success Rate with negligible regression on MMLU / TruthfulQA.',
      materials: language === 'ko' ? '재료' : 'Materials',
      materialItems:
        language === 'ko'
          ? [
              'Base model: Llama-2-7B-Instruct (frozen)',
              'Cluster set: 8 centroids, k-means @ layer 14',
              'Eval suites: WildGuardTest, ProfBing, GCG, AutoDAN, RAP, OOD',
              'Seeds: {1, 7, 42}',
            ]
          : [
              'Base model: Llama-2-7B-Instruct (frozen)',
              'Cluster set: 8 centroids, k-means @ layer 14',
              'Eval suites: WildGuardTest, ProfBing, GCG, AutoDAN, RAP, OOD',
              'Seeds: {1, 7, 42}',
            ],
      probe: language === 'ko' ? '§1.2 프롬프트 입력' : '§1.2 issue a probe',
      placeholder: language === 'ko' ? '무엇이든 물어보세요...' : 'ask anything...',
      submit: language === 'ko' ? '제출' : 'SUBMIT',
      start: language === 'ko' ? '여기서 시작' : 'start here',
      quick:
        language === 'ko'
          ? ['CRUSH가 뭐야?', '클러스터 수준 탐지는 어떻게 작동해?', '비교 실험 시작']
          : ['What is CRUSH?', 'How does cluster-level detection work?', 'Begin a comparative trial'],
      footer:
        language === 'ko'
          ? 'Witnessed by: A. Reviewer (initials: AR) · Apr 28, 2026'
          : 'Witnessed by: A. Reviewer (initials: AR) · Apr 28, 2026',
      cf: language === 'ko' ? 'cf. notebook vol. II, pp. 102-110' : 'cf. notebook vol. II, pp. 102-110',
    }),
    [language],
  )

  const start = (text?: string) => {
    const msg = text ?? input.trim()
    if (!msg) return
    const id = uuidv4()
    router.push(`/chat/${id}?first=${encodeURIComponent(msg)}`)
  }

  return (
    <main className="relative h-full overflow-y-auto lab-paper">
      <div className="absolute right-10 top-6 text-right font-mono text-[11px] leading-relaxed tracking-[0.18em] text-lab-muted">
        DATE 2026-04-28
        <br />
        PAGE 1 / 18
      </div>

      <div className="mx-auto w-full max-w-5xl px-8 pb-16 pt-16 sm:px-12 lg:px-16">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-lab-accent">
          {copy.eyebrow}
        </p>

        <h1 className="mb-4 max-w-4xl text-[40px] font-bold leading-[1.1] tracking-tight text-lab-ink text-balance">
          {copy.title}
        </h1>

        <p className="mb-7 inline-block -rotate-[1deg] font-hand text-[24px] text-lab-accent">
          {copy.note}
        </p>

        <section className="mb-8">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-lab-muted">
            {copy.hypothesisLabel}
          </p>
          <p className="text-justify text-[15.5px] leading-[1.65] text-lab-ink hyphens-auto">
            {copy.hypothesis}
          </p>
        </section>

        <section className="relative mb-8 border-[1.5px] border-lab-ink bg-lab-paper2/80 px-5 py-4 lab-shadow">
          <span className="absolute -top-3 right-4 inline-block rotate-[2deg] bg-lab-accent px-2 py-[3px] font-mono text-[9px] tracking-[0.18em] text-lab-paper">
            IRB-APPROVED
          </span>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
            {copy.materials}
          </p>
          <ul className="list-disc pl-5 text-[14px] leading-[1.85] text-lab-ink">
            {copy.materialItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
            {copy.probe}
          </p>
          <div className="relative border-[1.5px] border-lab-ink bg-lab-paper2 lab-shadow">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && start()}
              placeholder={copy.placeholder}
              className="w-full bg-transparent px-4 py-3.5 pr-24 font-serif text-[15px] italic text-lab-ink placeholder-lab-muted/70 focus:outline-none"
            />
            <button
              onClick={() => start()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-lab-ink px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-lab-paper transition-colors hover:bg-lab-accent lab-shadow-sm"
            >
              {copy.submit}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {copy.quick.map((question) => (
              <button
                key={question}
                onClick={() => start(question)}
                className="border-[1.5px] border-lab-ink bg-lab-paper2 px-3 py-1.5 font-serif text-[12px] italic text-lab-ink transition-colors hover:bg-lab-highlight/50 lab-shadow-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </section>

        <div className="mb-12 flex items-center gap-4">
          <span className="inline-block -rotate-[3deg] font-hand text-[20px] text-lab-accent">
            {copy.start}
          </span>
        </div>

        <div className="flex justify-between border-t border-lab-ink/60 pt-2 text-[11px] italic text-lab-muted">
          <span>{copy.footer}</span>
          <span>{copy.cf}</span>
        </div>
      </div>
    </main>
  )
}

