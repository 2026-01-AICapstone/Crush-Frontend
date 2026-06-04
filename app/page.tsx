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
          ? 'CRUSH: 유해 응답을 밀어내는 클러스터 기반 안전 시스템'
          : 'CRUSH: Cluster-based Repelling Units for Safety against Harmful Generation',
      note:
        language === 'ko'
          ? '위험한 방향으로 가는 답변을 초기에 감지하고 되돌릴 수 있을까?'
          : 'Can cluster-level signals steer harmful generations away early?',
      hypothesisLabel: language === 'ko' ? '핵심 가설' : 'Hypothesis',
      hypothesis:
        language === 'ko'
          ? '유해 요청의 hidden state는 중간 레이어에서 몇 개의 위험 클러스터로 모입니다. 생성 중인 상태가 이 클러스터에 가까워지면 CRUSH가 응답을 더 안전한 방향으로 유도합니다.'
          : 'Hidden states of harmful requests form separable clusters at intermediate layers. When a decoding state approaches those clusters, CRUSH steers the response toward a safer continuation.',
      materials: language === 'ko' ? '현재 설정' : 'Current setup',
      materialItems:
        language === 'ko'
          ? [
              'LLM 내부 표현을 기반으로 위험 신호를 감지',
              '5개 위해 카테고리 중심점과의 유사도 계산',
              '기본 모델과 CRUSH 적용 결과를 나란히 비교',
              '웹/백엔드/AI 서버를 분리한 전시용 데모',
            ]
          : [
              'Risk detection from internal LLM representations',
              'Centroid similarity across five harmful categories',
              'Side-by-side comparison between baseline and CRUSH',
              'Demo stack split across web, backend, and AI server',
            ],
      probe: language === 'ko' ? '프롬프트 입력' : 'Issue a probe',
      placeholder: language === 'ko' ? '비교해 볼 프롬프트를 입력하세요' : 'Ask anything to compare both arms...',
      submit: language === 'ko' ? '실행' : 'SUBMIT',
      start: language === 'ko' ? '아래 질문으로 바로 시작할 수 있습니다' : 'start with a sample prompt',
      quick:
        language === 'ko'
          ? ['CRUSH가 뭐야?', '위험 클러스터는 어떻게 감지해?', '비교 실험 시작하기']
          : ['What is CRUSH?', 'How does cluster-level detection work?', 'Begin a comparative trial'],
      posterBlocks:
        language === 'ko'
          ? [
              {
                label: '문제',
                title: '사후 필터만으로는 늦습니다',
                body: 'Jailbreak, 정서적 의존, 망상 동조 같은 상황은 답변이 나온 뒤 검열하는 방식으로는 놓치기 쉽습니다.',
              },
              {
                label: '해결',
                title: '생성 전에 latent space를 봅니다',
                body: 'CRUSH는 모델 내부 표현이 위험 클러스터로 향하는지 확인하고, 답변이 시작되기 전에 방향을 조정합니다.',
              },
              {
                label: '방법',
                title: '5개 위해 카테고리와 Pull-Push Loss',
                body: '악용, 폭력, 위험정보, 허위정보, 혐오/차별 군집을 분리하고 정상 표현은 보존하도록 학습합니다.',
              },
              {
                label: '기대효과',
                title: '다층 안전장치로 확장 가능',
                body: 'CRUSH 같은 매개변수적 방어와 rule-based guardrail을 결합해 더 촘촘한 방어 체계를 만들 수 있습니다.',
              },
            ]
          : [
              {
                label: 'Problem',
                title: 'Post-hoc filters react too late',
                body: 'Jailbreaks, emotional dependency, and delusion reinforcement can slip through filters that only inspect final text.',
              },
              {
                label: 'Solution',
                title: 'Inspect latent space before generation',
                body: 'CRUSH checks whether internal states move toward harmful clusters and steers them before the response is completed.',
              },
              {
                label: 'Method',
                title: 'Five risk groups with Pull-Push Loss',
                body: 'CRUSH separates harmful categories while preserving benign representations and language capability.',
              },
              {
                label: 'Impact',
                title: 'Fits into layered guardrails',
                body: 'Parameterized defense can be combined with rule-based filters for a stronger multi-layer safety stack.',
              },
            ],
      chips:
        language === 'ko'
          ? ['K-Means 5 cat', 'Pull-Push Loss', 'FastAPI', 'Spring Boot', 'Next.js', 'AWS EC2']
          : ['K-Means 5 cat', 'Pull-Push Loss', 'FastAPI', 'Spring Boot', 'Next.js', 'AWS EC2'],
      footer:
        language === 'ko'
          ? 'CRUSH 전시 데모'
          : 'CRUSH safety demo',
      cf: language === 'ko' ? '5개 위해 카테고리 기반' : '5-category safety clustering',
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
      <div className="absolute right-6 top-5 hidden text-right font-mono text-[11px] leading-relaxed tracking-[0.16em] text-lab-muted sm:block">
        DATE 2026-06-05
        <br />
        PAGE 1 / 18
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-12 sm:px-10 lg:px-16">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-lab-accent">
          {copy.eyebrow}
        </p>

        <h1 className="mb-4 max-w-4xl text-[32px] font-bold leading-[1.14] text-lab-ink text-balance sm:text-[40px]">
          {copy.title}
        </h1>

        <p className="mb-7 inline-block max-w-3xl -rotate-[1deg] font-hand text-[21px] leading-snug text-lab-accent sm:text-[24px]">
          {copy.note}
        </p>

        <section className="mb-8">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-lab-muted">
            {copy.hypothesisLabel}
          </p>
          <p className="max-w-4xl text-[15.5px] leading-[1.75] text-lab-ink">
            {copy.hypothesis}
          </p>
        </section>

        <section className="mb-8 grid gap-3 md:grid-cols-2">
          {copy.posterBlocks.map((block) => (
            <article
              key={block.label}
              className="border-[1.5px] border-lab-ink bg-lab-paper2/80 px-4 py-3 lab-shadow-sm"
            >
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-lab-accent">
                {block.label}
              </p>
              <h2 className="mb-1 text-[16px] font-bold leading-snug text-lab-ink">
                {block.title}
              </h2>
              <p className="text-[13.5px] leading-[1.65] text-lab-muted">
                {block.body}
              </p>
            </article>
          ))}
        </section>

        <section className="relative mb-8 border-[1.5px] border-lab-ink bg-lab-paper2/85 px-5 py-4 lab-shadow">
          <span className="absolute -top-3 right-4 inline-block rotate-[2deg] bg-lab-accent px-2 py-[3px] font-mono text-[9px] tracking-[0.16em] text-lab-paper">
            LIVE RUN
          </span>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
            {copy.materials}
          </p>
          <ul className="list-disc pl-5 text-[14px] leading-[1.85] text-lab-ink">
            {copy.materialItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {copy.chips.map((chip) => (
              <span
                key={chip}
                className="border border-lab-ink/50 bg-lab-highlight/25 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-lab-ink"
              >
                {chip}
              </span>
            ))}
          </div>
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
              className="w-full bg-transparent px-4 py-3.5 pr-24 text-[15px] text-lab-ink placeholder-lab-muted/70 focus:outline-none"
            />
            <button
              onClick={() => start()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-lab-ink px-3 py-2 font-mono text-[10px] tracking-[0.14em] text-lab-paper transition-colors hover:bg-lab-accent lab-shadow-sm"
            >
              {copy.submit}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {copy.quick.map((question) => (
              <button
                key={question}
                onClick={() => start(question)}
                className="border-[1.5px] border-lab-ink bg-lab-paper2 px-3 py-1.5 text-[12px] text-lab-ink transition-colors hover:bg-lab-highlight/50 lab-shadow-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </section>

        <div className="mb-12">
          <span className="inline-block -rotate-[3deg] font-hand text-[20px] text-lab-accent">
            {copy.start}
          </span>
        </div>

        <div className="flex flex-col gap-1 border-t border-lab-ink/60 pt-2 text-[11px] italic text-lab-muted sm:flex-row sm:justify-between">
          <span>{copy.footer}</span>
          <span>{copy.cf}</span>
        </div>
      </div>
    </main>
  )
}
