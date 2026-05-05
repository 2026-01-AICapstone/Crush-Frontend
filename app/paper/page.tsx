'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import Sidebar from '@/components/Sidebar'
import { BlockMath, InlineMath } from '@/components/MathBlock'

type Lang = 'ko' | 'en'

function Cite({ ids }: { ids: number[] }) {
  return (
    <sup className="font-mono text-[9px] text-lab-muted ml-0.5 tracking-tight">
      [{ids.join(', ')}]
    </sup>
  )
}

function Divider() {
  return <div className="border-t border-lab-ink/20 my-12" />
}

export default function PaperPage() {
  const [lang, setLang] = useState<Lang>('ko')
  const [collapsed, setCollapsed] = useState(false)
  const [input, setInput] = useState('')
  const router = useRouter()

  const t = (ko: string, en: string) => lang === 'ko' ? ko : en

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

        {/* ── Sticky toolbar ── */}
        <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-2.5 border-b border-lab-ink/20 bg-lab-paper/90 backdrop-blur-sm">
          <span className="font-mono text-[10px] tracking-[0.2em] text-lab-muted uppercase">
            CRUSH · Capstone 2026 · Team 0123
          </span>
          <div className="flex items-center gap-[1px] font-mono text-[11px]">
            <button
              onClick={() => setLang('ko')}
              className={`px-3 py-1.5 border border-lab-ink lab-shadow-sm transition-colors ${
                lang === 'ko'
                  ? 'bg-lab-ink text-lab-paper'
                  : 'bg-lab-paper2 text-lab-ink hover:bg-lab-highlight/50'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 border border-lab-ink lab-shadow-sm transition-colors ${
                lang === 'en'
                  ? 'bg-lab-ink text-lab-paper'
                  : 'bg-lab-paper2 text-lab-ink hover:bg-lab-highlight/50'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 pt-14 pb-24">

          {/* ════════════════════════════════════
              PAPER HEADER
          ════════════════════════════════════ */}
          <div className="mb-12 pb-8 border-b-2 border-lab-ink">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-lab-accent mb-3">
              {t('캡스톤 디자인 논문 초안 · Team 0123', 'Capstone Design Paper Draft · Team 0123')}
            </p>
            <h1 className="text-[26px] sm:text-[30px] font-bold leading-[1.25] tracking-tight text-lab-ink mb-6 text-balance">
              {t(
                'CRUSH: 잠재 공간 클러스터링 기반 LLM의 세밀한 유해성 탐지 및 맞춤형 방어 시스템',
                'CRUSH: Fine-grained Toxicity Detection and Adaptive Defense System Based on Latent Space Clustering in LLMs'
              )}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
              <div className="border border-lab-ink/30 px-4 py-3 bg-lab-paper2">
                <p className="font-mono text-[9px] tracking-[0.18em] text-lab-muted uppercase mb-1">
                  {t('저자', 'Authors')}
                </p>
                <p className="text-[13px] text-lab-ink">우민하 · 안진영 · 임재모</p>
                <p className="text-[11px] text-lab-muted italic mt-0.5">Team 0123</p>
              </div>
              <div className="border border-lab-ink/30 px-4 py-3 bg-lab-paper2">
                <p className="font-mono text-[9px] tracking-[0.18em] text-lab-muted uppercase mb-1">
                  {t('기반 모델', 'Base Model')}
                </p>
                <p className="text-[13px] text-lab-ink font-mono">Qwen2.5-0.5B-Instruct</p>
                <p className="text-[11px] text-lab-muted italic mt-0.5">LoRA r=16, α=16</p>
              </div>
              <div className="border border-lab-ink/30 px-4 py-3 bg-lab-paper2">
                <p className="font-mono text-[9px] tracking-[0.18em] text-lab-muted uppercase mb-1">
                  {t('상태', 'Status')}
                </p>
                <p className="text-[13px] text-lab-ink">{t('예비 실험 완료', 'Preliminary Experiments Done')}</p>
                <p className="text-[11px] text-lab-muted italic mt-0.5">2026-04</p>
              </div>
            </div>

            {/* Abstract */}
            <div className="relative border-[1.5px] border-lab-ink bg-lab-paper2/80 px-6 py-5 lab-shadow">
              <span className="absolute -top-3 left-4 font-mono text-[9px] tracking-[0.18em] px-2 py-[3px] bg-lab-accent text-lab-paper inline-block">
                {t('초록', 'ABSTRACT')}
              </span>
              <p className="text-[14px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  '본 연구는 대화형 AI의 정신 건강 위해성 문제, 특히 \'AI Psychosis\' 현상에 대응하기 위해 LLM 내부 잠재 공간의 기하학적 재구성에 기반한 화이트박스 방어 프레임워크 CRUSH(Cluster-based Repelling Unit for Safety & Harmful)를 제안한다. CRUSH는 Triplet Loss 구조를 개선한 4중 복합 손실 함수를 통해 유해성을 13개 이상의 세부 카테고리로 분류하고 각 카테고리에 맞는 맞춤형 방어를 제공한다. Qwen2.5-0.5B-Instruct 기반 예비 실험에서 안전-유해 군집 간 Centroid Distance가 5.3→13.5로 급증하고 Probe Accuracy 1.0을 달성함으로써, 단순 텍스트 필터링 대비 잠재 공간 제어의 우월성을 입증하였다.',
                  'This research proposes CRUSH (Cluster-based Repelling Unit for Safety & Harmful), a white-box defense framework based on geometric reconstruction of LLM internal latent space, to counter mental health harms from conversational AI—particularly the \'AI Psychosis\' phenomenon. CRUSH classifies harmfulness into 13+ detailed categories via a quadruple composite loss function improving Triplet Loss structure, providing customized defense for each category. Preliminary experiments on Qwen2.5-0.5B-Instruct demonstrated superiority of latent space control over simple text filtering, with Centroid Distance between safe-harmful clusters rapidly increasing 5.3→13.5 and Probe Accuracy reaching 1.0.'
                )}
              </p>
            </div>
          </div>

          {/* ════════════════════════════════════
              § 1  서론 / Introduction
          ════════════════════════════════════ */}
          <section className="mb-12">
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-lab-muted mb-1">§ 1</p>
              <h2 className="text-[22px] font-bold text-lab-ink">
                {t('서론', 'Introduction')}
              </h2>
            </div>

            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 1.1</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t('연구 배경: LLM의 확산과 AI Psychosis 문제', 'Research Background: LLM Proliferation and the AI Psychosis Problem')}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  '최근 대규모 언어 모델(LLM)의 급격한 발전은 자연어 이해와 생성 능력에서 혁신적인 진보를 가져왔으나, 동시에 모델이 유해하거나 편향된 콘텐츠를 생성할 수 있는 내재적 위험성을 수반하게 되었습니다.',
                  'The rapid development of large language models (LLMs) has brought revolutionary advances in natural language understanding and generation, while simultaneously introducing inherent risks of generating harmful or biased content.'
                )}
                <Cite ids={[3811]} />
                {' '}
                {t(
                  '특히 주목해야 할 사회적 문제는 \'AI Psychosis\' 현상입니다. 이는 대화형 AI가 사용자의 망상적 신념을 비판 없이 검증하고 동조함으로써 사용자가 현실 감각을 잃게 만들고, 종국에는 자해나 극단적 선택으로 몰고 가는 심리적 현상을 의미합니다.',
                  'A particularly pressing social concern is the \'AI Psychosis\' phenomenon—where conversational AI validates and reinforces delusional beliefs without critical judgment, causing users to lose their sense of reality and ultimately driving them toward self-harm or extreme choices.'
                )}
                <Cite ids={[4001, 4002]} />
                {' '}
                {t(
                  '단순히 욕설이나 불법 정보를 생성하는 차원을 넘어, 사용자가 AI와 위험한 정서적 의존 관계를 형성하게 되는 것은 LLM 안전성 분야에서 해결해야 할 시급한 과제입니다.',
                  'Beyond merely generating profanity or illegal information, the formation of dangerous emotional dependencies between users and AI is an urgent challenge in LLM safety research.'
                )}
                <Cite ids={[4003]} />
              </p>
            </div>

            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 1.2</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t('기존 연구의 한계: 사후 필터링 방식의 대응 한계', 'Limitations of Existing Research: Shortcomings of Post-hoc Filtering')}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  '현재 많은 기업이 채택하고 있는 주요 안전 장치는 생성된 텍스트를 검열하는 \'사후 필터링\' 방식입니다. 그러나 이러한 블랙박스(Black-box) 접근법은 점차 지능화되는 탈옥(Jailbreak) 프롬프트와 학습 데이터에 포함되지 않은 OOD(Out-of-Distribution) 공격 앞에서 무력한 모습을 보입니다.',
                  'The primary safety measure adopted by many companies today is a \'post-hoc filtering\' approach that censors generated text. However, this black-box approach proves ineffective against increasingly sophisticated jailbreak prompts and out-of-distribution (OOD) attacks not covered in training data.'
                )}
                <Cite ids={[4006, 4008, 4230]} />
                {' '}
                {t(
                  '텍스트 표면에 드러나지 않는 교묘한 심리적 유도나 우회 공격은 기존의 규칙 기반 혹은 별도 분류기 기반 필터링으로 완벽히 차단하기 어렵습니다.',
                  'Subtle psychological manipulation or circumvention attacks not visible on the text surface are difficult to completely block with existing rule-based or classifier-based filtering.'
                )}
                <Cite ids={[4008]} />
              </p>
            </div>

            <div className="mb-4">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 1.3</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t(
                  '연구 목적: 모델 내부 활성화 상태 통제를 통한 화이트박스 방어',
                  'Research Objective: White-box Defense through Model Internal Activation Control'
                )}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  '본 연구는 이러한 한계를 극복하기 위해 텍스트 이면의 모델 내부 활성화 상태(Activation)를 직접 통제하는 \'화이트박스\' 방식의 방어 메커니즘인 CRUSH(Cluster-based Repelling Unit for Safety & Harmful)를 제안합니다.',
                  'This research proposes CRUSH (Cluster-based Repelling Unit for Safety & Harmful), a \'white-box\' defense mechanism that directly controls the internal activation states (Activations) underlying the text, to overcome these limitations.'
                )}
                <Cite ids={[3933, 4008, 4232]} />
                {' '}
                {t(
                  'CRUSH는 단순한 이분법적 분류를 넘어, LLM 내부의 잠재 공간(Latent Space)을 분석하여 유해성의 종류를 세밀하게 탐지하고 그에 맞는 안전한 응답을 제공하는 것을 목적으로 합니다.',
                  'CRUSH aims to go beyond simple binary classification by analyzing the latent space inside LLMs to precisely detect types of harm and provide appropriately safe responses.'
                )}
                <Cite ids={[3995, 4012]} />
              </p>
            </div>
          </section>

          <Divider />

          {/* ════════════════════════════════════
              § 2  관련 연구 / Related Work
          ════════════════════════════════════ */}
          <section className="mb-12">
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-lab-muted mb-1">§ 2</p>
              <h2 className="text-[22px] font-bold text-lab-ink">
                {t('관련 연구', 'Related Work')}
              </h2>
            </div>

            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 2.1</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t('LLM 안전 정렬 및 탈옥 방어 기술 동향', 'LLM Safety Alignment and Jailbreak Defense Trends')}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  '기존의 LLM 안전 정렬은 주로 인간 피드백 기반 강화학습(RLHF)이나 지도 미세 조정(SFT)을 통해 이루어져 왔습니다. 그러나 이러한 방법론은 공격자가 모델의 가중치를 직접 조작하거나 특수한 프롬프트를 사용하는 화이트박스/그레이박스 공격에 취약할 수 있습니다. 최근에는 모델의 파라미터를 크게 수정하지 않으면서도 특정 레이어의 활성화를 제어하는 어댑터 방식의 연구가 활발히 진행되고 있습니다.',
                  'Traditional LLM safety alignment has primarily been achieved through Reinforcement Learning from Human Feedback (RLHF) or Supervised Fine-Tuning (SFT). However, these methodologies can be vulnerable to white-box/gray-box attacks where adversaries directly manipulate model weights or use special prompts. Recently, adapter-based research that controls activation at specific layers without significantly modifying model parameters has been actively pursued.'
                )}
              </p>
            </div>

            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 2.2</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t(
                  'REPBEND: 표현 굴절의 원리와 이분법적 분류의 한계',
                  'REPBEND: Principle of Representation Bending and Binary Classification Limitations'
                )}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  'CRUSH의 기술적 모태가 된 REPBEND(Representation Bending) 연구는 Loss 기반의 파인튜닝에 Activation Steering 개념을 도입하여 안전한 표현과 유해한 표현 공간을 분리하는 방법론을 제안했습니다.',
                  'REPBEND (Representation Bending), the technical foundation of CRUSH, proposed a methodology that introduces Activation Steering concepts into loss-based fine-tuning to separate safe and harmful representation spaces.'
                )}
                <Cite ids={[4015, 4017]} />
                {' '}
                {t(
                  'REPBEND는 잠재 공간을 \'구부리는(bending)\' 방식으로 안전 군집과 유해 군집 사이의 거리를 벌려 공격 성공률을 낮추는 데 성공했습니다.',
                  'REPBEND succeeded in reducing attack success rates by \'bending\' the latent space to widen the distance between safe and harmful clusters.'
                )}
                <Cite ids={[4018, 4019]} />
                {' '}
                {t(
                  '하지만 REPBEND는 유해성을 단순히 이분법적으로만 분류한다는 한계가 있으며, 이로 인해 답변의 다양성이 제약되거나 특정 상황에서 무의미한 토큰이 발생할 가능성이 존재합니다.',
                  'However, REPBEND has the limitation of classifying harmfulness only in a binary manner, which may constrain response diversity or generate meaningless tokens in certain situations.'
                )}
                <Cite ids={[4033, 4034]} />
              </p>
            </div>

            <div className="mb-4">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 2.3</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t(
                  '대조 학습(Contrastive Learning) 및 Triplet Loss의 클러스터링 활용',
                  'Contrastive Learning and Triplet Loss for Clustering'
                )}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  '본 연구는 REPBEND의 한계를 극복하기 위해 대조 학습(Contrastive Learning)의 핵심 기법인 Triplet Loss를 도입합니다.',
                  'This research introduces Triplet Loss, a core technique of Contrastive Learning, to overcome REPBEND\'s limitations.'
                )}
                <Cite ids={[3821, 4101]} />
                {' '}
                {t(
                  'Triplet Loss는 앵커(Anchor), 양성(Positive), 음성(Negative) 샘플 사이의 상대적 거리를 최적화함으로써 유해 데이터를 카테고리별로 군집화하는 데 탁월한 성능을 보입니다.',
                  'Triplet Loss demonstrates excellent performance in clustering harmful data by category by optimizing relative distances between Anchor, Positive, and Negative samples.'
                )}
                <Cite ids={[3862, 3871, 4103]} />
                {' '}
                {t(
                  '단순히 유해 벡터를 밀어내는 REPBEND 방식과 달리, Triplet Loss 구조는 특정 카테고리 내부의 응집력을 강화하고 서로 다른 유해 카테고리 간의 경계를 최적화하여 보다 정밀한 잠재 공간 재구성을 가능케 합니다.',
                  'Unlike REPBEND\'s simple repulsion approach, the Triplet Loss structure strengthens intra-category cohesion and optimizes boundaries between different harmful categories, enabling more precise latent space reconstruction.'
                )}
                <Cite ids={[4060, 4133]} />
              </p>
            </div>
          </section>

          <Divider />

          {/* ════════════════════════════════════
              § 3  제안 방법론 / Proposed Method
          ════════════════════════════════════ */}
          <section className="mb-12">
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-lab-muted mb-1">§ 3</p>
              <h2 className="text-[22px] font-bold text-lab-ink">
                {t('제안 방법론 (CRUSH Framework)', 'Proposed Method: CRUSH Framework')}
              </h2>
              <p className="text-[14px] leading-[1.75] text-lab-muted mt-2">
                {t(
                  '본 연구에서 제안하는 CRUSH 시스템은 LLM의 최종 출력을 검사하는 기존의 블랙박스 필터링 방식에서 벗어나, 모델 내부의 잠재 공간을 직접 재구성하는 화이트박스 방어 체계를 지향한다. 특히, 유해성을 단순히 \'안전\'과 \'위험\'으로 나누는 이분법적 접근을 넘어, 다중 카테고리 클러스터링을 통해 세밀한 독성 탐지 및 맞춤형 대응이 가능한 프레임워크를 제안한다.',
                  'The CRUSH system proposed in this research moves away from existing black-box filtering that inspects LLM final outputs, pursuing a white-box defense architecture that directly reconstructs the internal latent space. In particular, it proposes a framework capable of fine-grained toxicity detection and customized response through multi-category clustering, going beyond the binary \'safe vs. dangerous\' approach.'
                )}
              </p>
            </div>

            <div className="mb-9">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 3.1</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t('시스템 아키텍처 및 파이프라인', 'System Architecture and Pipeline')}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink mb-4">
                {t(
                  'CRUSH 시스템은 사용자의 프롬프트 입력부터 최종 안전 응답 생성까지 총 3단계의 핵심 파이프라인을 거쳐 작동한다.',
                  'The CRUSH system operates through 3 core pipeline stages from user prompt input to final safe response generation.'
                )}
              </p>
              <ol className="pl-6 space-y-3.5 list-decimal">
                {[
                  {
                    label: t('활성화 가로채기 (Activation Capture)', 'Activation Capture'),
                    desc: t(
                      '사용자의 질의가 입력되면 게이트웨이에서 사전에 정의된 특정 중간 레이어의 Residual Stream으로부터 활성화 벡터를 실시간으로 추출한다.',
                      'When a user query is input, the gateway extracts activation vectors in real-time from the Residual Stream of specific intermediate layers defined in advance.'
                    ),
                  },
                  {
                    label: t('잠재 공간 매핑 (LoRA Toxicity Mapping)', 'LoRA Toxicity Mapping'),
                    desc: t(
                      '추출된 고차원 벡터는 경량화된 LoRA(Low-Rank Adaptation) 어댑터를 통과하며, 해당 어댑터는 입력된 의도를 잠재 공간 상의 다중 독성 클러스터로 매핑한다.',
                      'The extracted high-dimensional vectors pass through a lightweight LoRA (Low-Rank Adaptation) adapter that maps the input intent to multiple toxicity clusters in latent space.'
                    ),
                  },
                  {
                    label: t('지능형 라우팅 (Response Routing & Action)', 'Response Routing & Action'),
                    desc: t(
                      '잠재 공간에서 식별된 독성 카테고리(예: 자해, 폭력, 혐오 등)에 따라 시스템은 \'대화 즉시 중단\', \'안전 가이드라인 제공\', 혹은 \'정상 답변 생성\' 등의 최적화된 방어 액션을 수행한다.',
                      'Based on the toxicity category identified in latent space (e.g., self-harm, violence, hate speech), the system performs optimized defense actions such as \'immediate conversation termination\', \'providing safety guidelines\', or \'generating normal responses\'.'
                    ),
                  },
                ].map(({ label, desc }) => (
                  <li key={label} className="text-[14.5px] leading-[1.75] text-lab-ink">
                    <span className="font-semibold">{label}: </span>{desc}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mb-9">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 3.2</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t('최적 타겟 레이어 분석 및 활성화 추출', 'Optimal Target Layer Analysis and Activation Extraction')}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto mb-3">
                {t(
                  '본 연구에서는 모델의 언어 확률 공간을 훼손하지 않으면서도 유해한 의도만을 효과적으로 제어하기 위해 최적 타겟 레이어(Target Layers)를 식별하는 실험을 수행하였다.',
                  'This research conducted experiments to identify optimal target layers that effectively control harmful intent without damaging the model\'s language probability space.'
                )}
              </p>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto mb-3">
                {t(
                  '실험 결과, Qwen2.5-0.5B 모델의 경우 20번째 이후의 후반부 레이어를 직접 수정할 시 "cko", "urgeonu"와 같은 무의미한 토큰이 반복 생성되는 \'언어 붕괴\' 현상이 관찰되었다. 이는 모델의 출력단에 너무 가까운 레이어를 건드릴 경우 텍스트 생성의 일관성이 심각하게 왜곡됨을 시사한다.',
                  'Experimental results showed that targeting layers 20+ in the Qwen2.5-0.5B model caused \'language collapse\' phenomena where meaningless tokens like "cko", "urgeonu" were repeatedly generated. This suggests that modifying layers too close to the output layer severely distorts text generation consistency.'
                )}
              </p>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto mb-3">
                {t('따라서 본 연구는 모델의 \'전두엽\' 역할을 수행하며 의도를 파악하기 시작하는 중간 레이어 구간인 ', 'Therefore, this research targeted the intermediate layer range ')}
                <span className="font-mono font-semibold text-lab-accent">L15~17</span>
                {t(
                  '을 타겟팅하여 학습을 진행하였으며, 이를 통해 일반 추론 능력과 방어 성능 사이의 Pareto-frontier를 달성하였다.',
                  ', which begins to understand intent playing the role of the model\'s \'prefrontal cortex\', achieving a Pareto-frontier between general reasoning capability and defense performance.'
                )}
              </p>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  '활성화 추출 과정에서는 activation.py 모듈을 통해 레이어의 최종 출력뿐만 아니라 어텐션 이전(pre-attn-norm)과 피드포워드 이전(pre-ffn-norm) 등 세밀한 연산 단계별 텐서를 분리하여 분석 데이터로 활용한다.',
                  'The activation extraction process uses the activation.py module to separately analyze fine-grained computational stage tensors including pre-attention normalization (pre-attn-norm) and pre-feedforward normalization (pre-ffn-norm) in addition to the layer\'s final output.'
                )}
              </p>
            </div>

            <div className="mb-9">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 3.3</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t('다중 카테고리 클러스터링 설계', 'Multi-category Clustering Design')}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto mb-4">
                {t(
                  'CRUSH의 핵심 혁신은 유해성을 다중 카테고리로 군집화하여 관리하는 데 있다. 본 연구는 Llama-Guard 3의 안전 가이드라인을 차용하여 폭력, 혐오 표현, 성적 콘텐츠, 자해 등 13개 이상의 세부 독성 카테고리를 정의하였다.',
                  'CRUSH\'s core innovation lies in managing harmfulness through multi-category clustering. This research adopted Llama-Guard 3\'s safety guidelines to define 13+ detailed toxicity categories including violence, hate speech, sexual content, and self-harm.'
                )}
              </p>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto mb-4">
                {t('각 카테고리는 잠재 공간 내에서 독립적인 중심점(Centroid, ', 'Each category forms an independent centroid (')}
                <InlineMath math="\mu_k" />
                {t(
                  ')을 형성한다. 새로운 질의가 입력될 때, 모델은 해당 활성화 벡터가 어떤 카테고리의 중심점과 가장 가까운지를 수학적 거리(Euclidean Distance 및 Cosine Similarity) 기반으로 판별한다.',
                  ') in latent space. When a new query is input, the model determines which category centroid the activation vector is closest to based on mathematical distance (Euclidean Distance and Cosine Similarity).'
                )}
              </p>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink">
                {t(
                  '이러한 설계는 이분법적 분류 모델보다 훨씬 정밀한 독성 탐지 해상도를 제공한다.',
                  'This design provides much more precise toxicity detection resolution than binary classification models.'
                )}
              </p>
            </div>

            <div className="mb-4">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 3.4</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t('CRUSH 커스텀 손실 함수 설계', 'CRUSH Custom Loss Function Design')}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink mb-5">
                {t(
                  '안정적인 다중 클러스터 형성과 기존 공격 경로의 원천 파괴를 위해 본 연구는 Triplet Loss 구조를 개선한 4중 복합 손실 함수를 제안한다.',
                  'This research proposes a quadruple composite loss function improving Triplet Loss structure for stable multi-cluster formation and fundamental destruction of existing attack pathways.'
                )}
              </p>

              <BlockMath math="\mathcal{L}_{Total} = \alpha \mathcal{L}_{benign} + \beta \mathcal{L}_{pull} + \gamma \mathcal{L}_{push} + \lambda \mathcal{L}_{KL}" />

              <div className="mt-7 mb-6">
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">
                  {t('① 카테고리 응집 및 공격 경로 파괴', '① Category Cohesion & Attack Path Destruction')}
                  {' — '}<InlineMath math="\mathcal{L}_{pull}" />
                </p>
                <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto mb-3">
                  {t('유해 프롬프트 입력 시 발생하는 벡터 ', 'Strongly converges the vector ')}
                  <InlineMath math="h'_{k,i}" />
                  {t('를 해당 카테고리의 목표 중심점 ', ' generated on harmful prompt input to the target centroid ')}
                  <InlineMath math="\mu_k" />
                  {t(
                    '로 강하게 수렴시킨다. 동시에 원본 모델에서 유해 답변 생성 경로로 사용되던 기존 벡터 ',
                    ' of that category. Simultaneously, it physically destroys sophisticated Jailbreak pathways by distancing from the original vector '
                  )}
                  <InlineMath math="h_{k,i}" />
                  {t(
                    '로부터 일정 마진(m_pull) 이상 이격시켜 지능화된 Jailbreak 경로를 물리적으로 파괴한다.',
                    ' (used as the harmful response generation pathway) by more than a certain margin (m_pull).'
                  )}
                </p>
                <BlockMath math="\mathcal{L}_{pull} = \frac{1}{N_h} \sum_{k=1}^{K} \sum_{i \in C_k} \max\!\left(0,\; d(h_{k,i}',\, \mu_k) - d(h_{k,i}',\, h_{k,i}) + m_{pull}\right)" />
              </div>

              <div className="mb-6">
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">
                  {t('② 클러스터 간 상호 배척', '② Inter-cluster Mutual Repulsion')}
                  {' — '}<InlineMath math="\mathcal{L}_{push}" />
                </p>
                <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto mb-3">
                  {t(
                    '서로 다른 유해 카테고리 간의 오분류를 방지하기 위해, 현재 벡터가 속하지 않은 타 카테고리의 중심점 ',
                    'To prevent misclassification between different harmful categories, it ensures the distance from the centroid '
                  )}
                  <InlineMath math="\mu_j" />
                  {t(
                    ' 중 가장 가까운 것과의 거리를 마진 이상으로 벌려 잠재 공간 내의 변별력을 확보한다.',
                    ' of other categories is maintained beyond a margin, securing discriminability in latent space.'
                  )}
                </p>
                <BlockMath math="\mathcal{L}_{push} = \frac{1}{N_h} \sum_{k=1}^{K} \sum_{i \in C_k} \max\!\left(0,\; d(h_{k,i}',\, \mu_k) - \min_{j \neq k}\, d(h_{k,i}',\, \mu_j) + m_{push}\right)" />
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">
                  {t('③ 일반 성능 및 지능 보존', '③ General Performance & Intelligence Preservation')}
                  {' — '}<InlineMath math="\mathcal{L}_{benign}" />
                  {', '}<InlineMath math="\mathcal{L}_{KL}" />
                </p>
                <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                  {t(
                    '방어 어댑터의 개입이 일반적인 대화 능력의 퇴화(Catastrophic Forgetting)를 유발하지 않도록 안전한 질의에 대해서는 원본 모델의 표현을 유지하는 ',
                    'To prevent the defense adapter\'s intervention from causing Catastrophic Forgetting of general conversation ability, '
                  )}
                  <InlineMath math="\mathcal{L}_{benign}" />
                  {t(
                    '과 출력 확률 분포의 변화를 억제하는 KL Divergence Loss를 적용한다.',
                    ' maintains the original model\'s representations for safe queries, while KL Divergence Loss suppresses changes in output probability distribution.'
                  )}
                </p>
              </div>
            </div>
          </section>

          <Divider />

          {/* ════════════════════════════════════
              § 4  실험 / Experiments
          ════════════════════════════════════ */}
          <section className="mb-12">
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-lab-muted mb-1">§ 4</p>
              <h2 className="text-[22px] font-bold text-lab-ink">
                {t('현재 진행 상황 및 예비 실험 분석', 'Current Progress & Preliminary Results')}
              </h2>
              <p className="text-[14px] text-lab-muted mt-2 leading-[1.7]">
                {t(
                  '본 장에서는 CRUSH 프레임워크의 유효성을 검증하기 위해 수행된 예비 실험 환경과 그에 따른 정량적·정성적 분석 결과를 기술한다.',
                  'This section describes the preliminary experimental environment conducted to validate CRUSH framework efficacy and the resulting quantitative/qualitative analysis.'
                )}
              </p>
            </div>

            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 4.1</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t('실험 환경 및 하이퍼파라미터 설정', 'Experimental Setup and Hyperparameters')}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto mb-4">
                {t(
                  '본 연구의 베이스 모델로는 Qwen2.5-0.5B-Instruct를 사용하였다. 학습 데이터는 WildGuardMix(안전/유해 응답), WildJailbreak(적대적 공격), UltraChat(일반 대화)에서 각각 추출된 샘플을 활용하였으며, 효율적인 파인튜닝을 위해 LoRA(Low-Rank Adaptation)를 적용하였다. LoRA의 Rank와 Alpha는 각각 16으로 설정하였으며, Adam Optimizer와 1.0×10⁻⁵의 학습률(Learning Rate)을 적용하여 최적화를 진행하였다.',
                  'The base model used in this research is Qwen2.5-0.5B-Instruct. Training data utilized samples extracted from WildGuardMix (safe/harmful responses), WildJailbreak (adversarial attacks), and UltraChat (general conversation), with LoRA (Low-Rank Adaptation) applied for efficient fine-tuning. LoRA\'s Rank and Alpha were both set to 16, with Adam Optimizer and 1.0×10⁻⁵ learning rate applied for optimization.'
                )}
              </p>
              <div className="border border-lab-ink/30 bg-lab-paper2 px-5 py-4 font-mono text-[12.5px] lab-shadow-sm">
                <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1.5">
                  <span className="text-lab-muted">{t('베이스 모델', 'Base Model')}</span>
                  <span>Qwen2.5-0.5B-Instruct</span>
                  <span className="text-lab-muted">LoRA Rank / Alpha</span>
                  <span>16 / 16</span>
                  <span className="text-lab-muted">Optimizer</span>
                  <span>Adam</span>
                  <span className="text-lab-muted">Learning Rate</span>
                  <span>1.0 × 10⁻⁵</span>
                  <span className="text-lab-muted">{t('학습 데이터', 'Training Data')}</span>
                  <span>WildGuardMix · WildJailbreak · UltraChat</span>
                  <span className="text-lab-muted">{t('타겟 레이어', 'Target Layers')}</span>
                  <span className="text-lab-accent font-semibold">L15 ~ L17</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 4.2</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-4">
                {t('최적 타겟 레이어 분석: 언어 모델 안정성 검증', 'Optimal Target Layer Analysis: Language Model Stability Verification')}
              </h3>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-lab-accent/60">
                  <p className="font-mono text-[10px] tracking-[0.14em] text-lab-accent uppercase mb-1.5">
                    {t('후반부 레이어 타겟팅 (L20+) — 언어 붕괴', 'Posterior Layer Targeting (L20+) — Language Collapse')}
                  </p>
                  <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                    {t(
                      '초기 실험에서 출력층에 인접한 20번째 이후 레이어를 타겟팅했을 때, 모델의 확률 공간이 심각하게 왜곡되는 현상이 관찰되었다. 구체적으로 유해 질문 입력 시 "cko", "urgeonu"와 같은 무의미한 토큰이 무한 반복 생성되거나 문장이 완전히 붕괴되는 \'언어 붕괴\' 현상이 발생하였다.',
                      'In initial experiments targeting layers 20+ adjacent to the output layer, severe distortion of the model\'s probability space was observed. Specifically, \'language collapse\' phenomena occurred where meaningless tokens like "cko", "urgeonu" were infinitely generated or sentences completely collapsed when given harmful queries.'
                    )}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-lab-green/70">
                  <p className="font-mono text-[10px] tracking-[0.14em] text-lab-green uppercase mb-1.5">
                    {t('중간 레이어 타겟팅 (L15~17) — Pareto-frontier 달성', 'Middle Layer Targeting (L15~17) — Pareto-frontier Achieved')}
                  </p>
                  <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                    {t(
                      '반면, 모델의 추론 의도가 형성되기 시작하는 중간 레이어 구간인 L15~17을 타겟팅했을 때는 모델 본연의 지능을 보존하면서 유해한 답변 경로만을 성공적으로 굴절(Bending)시킬 수 있었다. 이를 통해 방어 성능과 언어 모델의 사용성 사이의 Pareto-frontier를 달성할 수 있음을 확인하였다.',
                      'In contrast, targeting the middle layer range L15~17 where the model begins forming reasoning intent successfully deflected only harmful response pathways while preserving the model\'s inherent intelligence. This confirmed achievement of a Pareto-frontier between defense performance and language model usability.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 4.3</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t('잠재 공간 시각화 분석 (PCA 및 Trajectory)', 'Latent Space Visualization Analysis (PCA and Trajectory)')}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto mb-5">
                {t(
                  '추출된 활성화 벡터를 PCA(주성분 분석) 및 Trajectory 분석을 통해 시각화한 결과, 다음과 같은 모델 내부의 \'생각의 흐름\' 변화를 포착하였다.',
                  'Visualizing extracted activation vectors through PCA (Principal Component Analysis) and Trajectory analysis captured the following changes in the model\'s internal \'thought flow\':'
                )}
              </p>
              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-lab-ink/25">
                  <p className="font-mono text-[10px] text-lab-muted uppercase tracking-wider mb-1.5">
                    {t('동기화 구간 (L0~L12)', 'Synchronization Phase (L0~L12)')}
                  </p>
                  <p className="text-[14.5px] leading-[1.8] text-lab-ink">
                    {t(
                      '질문의 유해 여부와 상관없이 초반 레이어에서는 안전한 질문과 유해한 질문의 궤적이 완벽하게 겹쳐서 이동한다. 이는 모델의 초기 단계가 단순한 문법 파악 및 단어 조합에 집중함을 의미한다.',
                      'Regardless of whether a question is harmful, the trajectories of safe and harmful queries move together completely overlapped in early layers. This means the model\'s initial stages focus on simple grammar parsing and word combination.'
                    )}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-lab-accent/50">
                  <p className="font-mono text-[10px] text-lab-muted uppercase tracking-wider mb-1.5">
                    {t('분기 및 분리 (L13~L23)', 'Divergence & Separation (L13~L23)')}
                  </p>
                  <p className="text-[14.5px] leading-[1.8] text-lab-ink">
                    {t(
                      '13번째 레이어를 기점으로 두 궤적이 서서히 벌어지기 시작하며, 후반부 레이어인 L22~23에 이르면 잠재 공간 상에서 안전 군집(Safe Zone)과 유해 군집(Unsafe Zone)이 기하학적으로 분리되는 양상을 보인다. 특히 t-SNE 분석 결과, 교묘하게 우회된 탈옥 프롬프트들이 안전 구역 경계에 섞여 들어가는 지점을 식별함으로써 CRUSH의 정밀 탐지 필요성을 입증하였다.',
                      'Starting from layer 13, the two trajectories gradually diverge, and at posterior layers L22~23, safe zones and unsafe zones geometrically separate in latent space. Particularly, t-SNE analysis identified jailbreak prompts cleverly mixed at the boundary of the safe zone, proving CRUSH\'s need for precise detection.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 4.4</p>
              <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                {t('주요 성능 지표 평가', 'Key Performance Metrics Evaluation')}
              </h3>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink mb-5">
                {t(
                  '학습 에폭(Epoch) 증가에 따른 정량적 지표 변화를 분석한 결과, CRUSH 프레임워크가 잠재 공간을 성공적으로 재구성하고 있음을 확인하였다.',
                  'Analyzing quantitative metric changes with training epoch increases confirmed CRUSH framework\'s successful latent space reconstruction.'
                )}
              </p>
              <div className="border border-lab-ink/30 bg-lab-paper2 lab-shadow overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-lab-ink/30 bg-lab-ink/5">
                      <th className="text-left px-4 py-2.5 font-mono text-[9.5px] tracking-[0.14em] text-lab-muted uppercase">{t('지표', 'Metric')}</th>
                      <th className="text-center px-4 py-2.5 font-mono text-[9.5px] tracking-[0.14em] text-lab-muted uppercase">{t('초기 (10 Epoch)', 'Early (10 Epoch)')}</th>
                      <th className="text-center px-4 py-2.5 font-mono text-[9.5px] tracking-[0.14em] text-lab-muted uppercase">{t('최종', 'Final')}</th>
                      <th className="text-left px-4 py-2.5 font-mono text-[9.5px] tracking-[0.14em] text-lab-muted uppercase">{t('의미', 'Interpretation')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lab-ink/10">
                    <tr>
                      <td className="px-4 py-3 font-mono">Centroid Distance</td>
                      <td className="px-4 py-3 text-center text-lab-muted">~5.3</td>
                      <td className="px-4 py-3 text-center font-semibold text-lab-green">~13.5</td>
                      <td className="px-4 py-3 text-[12px] text-lab-ink">{t('안전-유해 군집 물리적 분리', 'Physical separation of safe-harmful clusters')}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono">Cosine Similarity</td>
                      <td className="px-4 py-3 text-center text-lab-muted">—</td>
                      <td className="px-4 py-3 text-center font-semibold text-lab-ink">0.8 ~ 0.9</td>
                      <td className="px-4 py-3 text-[12px] text-lab-ink">{t('언어 흐름 보존, 유해 위치만 굴절', 'Linguistic flow preserved, harmful position deflected')}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono">Probe Accuracy</td>
                      <td className="px-4 py-3 text-center text-lab-muted">—</td>
                      <td className="px-4 py-3 text-center font-bold text-lab-accent">1.0</td>
                      <td className="px-4 py-3 text-[12px] text-lab-ink">{t('활성화만으로 유해성 완벽 식별', 'Perfect toxicity identification from activations alone')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <Divider />

          {/* ════════════════════════════════════
              § 5  논의 및 향후 과제
          ════════════════════════════════════ */}
          <section className="mb-12">
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-lab-muted mb-1">§ 5</p>
              <h2 className="text-[22px] font-bold text-lab-ink">
                {t('논의 및 향후 과제', 'Discussion & Future Roadmap')}
              </h2>
              <p className="text-[14px] text-lab-muted mt-2 leading-[1.7]">
                {t(
                  'CRUSH 프레임워크는 예비 실험을 통해 잠재 공간의 기하학적 재구성 가능성을 성공적으로 입증하였다. 실질적인 현장 적용과 방어 정밀도 극대화를 위해 다음과 같은 고도화 과정을 추진할 예정이다.',
                  'The CRUSH framework successfully demonstrated the possibility of geometric reconstruction of latent space through preliminary experiments. The following enhancement processes will be pursued for practical application and maximizing defense precision.'
                )}
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 5.1</p>
                <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                  {t('데이터셋 정밀 카테고리화 및 라벨링 고도화', 'Dataset Fine-grained Categorization and Labeling Enhancement')}
                </h3>
                <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                  {t(
                    '현재 학습에 사용된 유해 데이터셋은 주로 \'유해\'와 \'무해\'라는 이분법적 라벨링에 의존하고 있다. CRUSH의 핵심인 다중 클러스터링을 정교화하기 위해, Llama-Guard 3 또는 OpenAI Moderation API와 같은 외부 안전성 검사 모델을 활용할 계획이다. 이를 통해 폭력 범죄(S1), 비폭력 범죄(S2), 혐오 표현(S9), 자해(S6) 등 최소 13가지 이상의 세부 독성 카테고리로 데이터를 재분류함으로써 잠재 공간 내 클러스터 변별력을 높이고자 한다.',
                    'The harmful dataset currently used for training mainly relies on binary labeling of \'harmful\' and \'harmless\'. To refine CRUSH\'s core multi-clustering, plans to utilize external safety inspection models such as Llama-Guard 3 or OpenAI Moderation API. Through this, data will be reclassified into at least 13 detailed toxicity categories such as violent crimes (S1), non-violent crimes (S2), hate speech (S9), and self-harm (S6) to improve cluster discriminability in latent space.'
                  )}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 5.2</p>
                <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                  {t('알고리즘 안정화: 지수 이동 평균(EMA) 기반 중심점 관리', 'Algorithm Stabilization: EMA-based Centroid Management')}
                </h3>
                <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                  {t('다중 클러스터링 학습 과정에서 각 카테고리의 중심점(', 'In the multi-clustering training process, each category\'s centroid (')}
                  <InlineMath math="\mu_k" />
                  {t(
                    ')은 배치(Batch) 구성에 따라 매 단계 급격하게 변동할 수 있는 불안정성을 내포한다. 이러한 변동성을 억제하고 학습의 수렴 속도를 높이기 위해, 각 스텝에서의 배치 평균이 아닌 지수 이동 평균(Exponential Moving Average, EMA) 방식을 도입하여 중심점을 업데이트할 예정이다. 이는 잠재 공간의 위상 구조를 안정적으로 유지하여, 새로운 입력 벡터에 대한 분류 신뢰도를 확보하는 데 기여할 것이다.',
                    ') may fluctuate dramatically at each step depending on batch composition. To suppress this variability and accelerate training convergence, plans to update centroids using Exponential Moving Average (EMA) rather than the batch average at each step. This will contribute to maintaining stable topological structure in latent space and ensuring classification confidence for new input vectors.'
                  )}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 5.3</p>
                <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                  {t('카테고리 맞춤형 방어 라우팅 및 시스템 통합', 'Category-specific Defense Routing and System Integration')}
                </h3>
                <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                  {t(
                    '잠재 공간 내에서 식별된 독성 카테고리에 따라 최적의 방어 기제가 동적으로 개입하는 지능형 라우팅(Intelligent Routing) 시스템을 구축할 계획이다. 예를 들어, \'혐오 표현\' 탐지 시에는 즉각적인 대화 중단 액션을 취하고, \'자해\' 관련 탐지 시에는 전문 상담 기관 안내 등의 안전 가이드라인을 제공하는 방식이다. 이러한 카테고리별 맞춤 대응은 단순 거절보다 훨씬 고차원적인 사용자 보호 경험을 제공할 수 있다.',
                    'Plans to build an Intelligent Routing system where optimal defense mechanisms dynamically intervene based on the toxicity category identified in latent space. For example, \'hate speech\' detection triggers immediate conversation termination, while \'self-harm\' detection provides safety guidelines including professional counseling referrals. This category-specific customized response can provide a much higher-level user protection experience than simple refusal.'
                  )}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-lab-muted mb-2">§ 5.4</p>
                <h3 className="text-[16px] font-semibold text-lab-ink mb-3">
                  {t('웹 기반 실시간 시연 및 사용자 경험 평가', 'Web-based Real-time Demo and UX Evaluation')}
                </h3>
                <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                  {t(
                    '풀스택 개발 환경과의 연계를 통해, CRUSH 어댑터가 실시간으로 작동하는 웹 시연 시스템을 완성할 예정이다. 사용자의 입력 프롬프트가 시스템 내부에서 어떻게 벡터화되고, 어떤 카테고리의 중심점과 가까운지 실시간 시각화 지표(Distance, Cosine Sim)로 보여줌으로써 프로젝트의 기술적 투명성과 학술적 신뢰도를 사용자들에게 직접 전달하고자 한다.',
                    'Through integration with the full-stack development environment, plans to complete a web demonstration system where the CRUSH adapter operates in real-time. By showing real-time visualization metrics (Distance, Cosine Sim) of how a user\'s input prompt is vectorized internally and how close it is to which category centroid, the project aims to directly convey technical transparency and academic credibility to users.'
                  )}
                </p>
              </div>
            </div>
          </section>

          <Divider />

          {/* ════════════════════════════════════
              § 6  결론 / Conclusion
          ════════════════════════════════════ */}
          <section className="mb-14">
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-lab-muted mb-1">§ 6</p>
              <h2 className="text-[22px] font-bold text-lab-ink">
                {t('결론', 'Conclusion')}
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  '본 연구는 대화형 AI의 안전성을 위협하는 지능적 Jailbreak와 OOD 공격에 대응하기 위해, 모델의 내부 활성화를 직접 제어하는 잠재 공간 클러스터링 기반의 CRUSH 프레임워크를 제안하였다.',
                  'This research proposed the CRUSH framework, a latent space clustering-based defense system that directly controls model internal activation to counter sophisticated Jailbreak and OOD attacks threatening conversational AI safety.'
                )}
              </p>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  '연구 결과, 모델의 중간 레이어인 L15~17을 타겟팅하여 Triplet Loss를 적용함으로써 모델 본연의 일반적인 추론 능력을 보존하면서도 유해한 표현 공간을 성공적으로 분리할 수 있음을 입증하였다. 특히 Centroid Distance가 5.3에서 13.5로 급증하고 Probe Accuracy가 1.0에 도달한 실험 데이터는, 단순한 텍스트 필터링보다 잠재 공간의 기하학적 재구성이 훨씬 강력하고 정밀한 방어막을 형성할 수 있음을 보여준다.',
                  'Research results demonstrated that targeting the model\'s middle layers L15~17 and applying Triplet Loss successfully separates harmful expression space while preserving the model\'s general reasoning capabilities. Particularly, experimental data showing Centroid Distance rapidly increasing from 5.3 to 13.5 and Probe Accuracy reaching 1.0 demonstrates that geometric reconstruction of latent space can form a much more powerful and precise defense barrier than simple text filtering.'
                )}
              </p>
              <p className="text-[14.5px] leading-[1.8] text-lab-ink text-justify hyphens-auto">
                {t(
                  'CRUSH 프로젝트는 향후 세부 독성 카테고리별 맞춤형 방어 기제와 결합하여, 보다 안전하고 책임감 있는 AI 생태계를 구축하는 데 학술적·기술적 기여를 할 것으로 기대된다.',
                  'The CRUSH project is expected to make academic and technical contributions to building a safer and more responsible AI ecosystem when combined with customized defense mechanisms for detailed toxicity categories in the future.'
                )}
              </p>
            </div>
          </section>

          {/* ════════════════════════════════════
              Demo CTA
          ════════════════════════════════════ */}
          <div className="border-t-2 border-lab-ink pt-10">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-lab-accent mb-2">
              § Demo
            </p>
            <h2 className="text-[20px] font-bold text-lab-ink mb-2">
              {t('실시간 비교 시연', 'Live Comparative Demo')}
            </h2>
            <p className="text-[14px] text-lab-muted mb-5 leading-[1.65]">
              {t(
                'Baseline LLM과 CRUSH 모델의 응답을 좌/우 분할 화면에서 동시에 비교합니다.',
                'Compare Baseline LLM and CRUSH model responses side-by-side in a split-screen view.'
              )}
            </p>
            <div className="relative border-[1.5px] border-lab-ink bg-lab-paper2 lab-shadow max-w-xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && start()}
                placeholder={t('프롬프트를 입력하세요…', 'Enter a prompt to begin…')}
                className="w-full bg-transparent px-4 py-3.5 pr-28 text-[15px] text-lab-ink placeholder-lab-muted/70 focus:outline-none font-serif italic"
              />
              <button
                onClick={() => start()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-lab-ink text-lab-paper font-mono text-[10px] tracking-[0.16em] hover:bg-lab-accent transition-colors lab-shadow-sm"
              >
                {t('시작 ↵', 'START ↵')}
              </button>
            </div>
            <p className="text-[11px] text-lab-muted mt-2.5 font-mono">
              {t('새 세션이 자동 생성됩니다 · UUID v4', 'A new session is created automatically · UUID v4')}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-4 border-t border-lab-ink/40 flex justify-between text-[11px] italic text-lab-muted">
            <span>{t('Team 0123 · 캡스톤 디자인 2026', 'Team 0123 · Capstone Design 2026')}</span>
            <span>CRUSH v0.1 draft</span>
          </div>

        </div>
      </main>
    </div>
  )
}
