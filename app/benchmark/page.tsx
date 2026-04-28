'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'

const radarData = [
  { axis: 'Trust', CRUSH: 99, Baseline: 40 },
  { axis: 'RAP', CRUSH: 72, Baseline: 55 },
  { axis: 'GCG', CRUSH: 88, Baseline: 30 },
  { axis: 'AutoDAN', CRUSH: 95, Baseline: 28 },
  { axis: 'Jailbreak', CRUSH: 97, Baseline: 22 },
  { axis: 'OOD', CRUSH: 82, Baseline: 60 },
]

const barData = [
  { name: 'CRUSH (ours)', value: 3.53, ours: true },
  { name: 'NPO', value: 11.47 },
  { name: 'GD', value: 12.15 },
  { name: 'RMU', value: 21.38 },
  { name: 'TAR', value: 55.4 },
]

const tableData = [
  { name: 'Black-box (avg.)',         baseline: 42.10, npo: 11.47, gd: 12.15, rmu: 21.38, crush: 2.78 },
  { name: 'White-box (avg.)',         baseline: 38.50, npo: 12.40, gd: 14.20, rmu: 18.90, crush: 3.53 },
  { name: 'OOD generalization',       baseline: 61.20, npo: 48.00, gd: 50.10, rmu: 55.40, crush: 0.80 },
  { name: 'WildGuardTest (1st-cat)',  baseline: 45.00, npo: 28.10, gd: 30.20, rmu: 22.40, crush: 0.00 },
]

const statCards = [
  { label: 'Black-box ASR',    value: '2.78',  unit: '%', note: '↓ 10.87 pp vs. NPO',     rot: -0.7 },
  { label: 'White-box ASR',    value: '3.53',  unit: '%', note: '↓ 7.62 pp vs. mean',     rot: 0.5 },
  { label: 'Profiling defense',value: '99.2',  unit: '%', note: 'ProfBing',                rot: -0.4 },
  { label: 'WildGuardTest',    value: '100',   unit: '%', note: '1st in all categories',   rot: 0.8 },
]

const INK = '#1d2536'
const ACCENT = '#b04a2f'
const MUTED = '#5b6275'

export default function BenchmarkPage() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 overflow-y-auto lab-paper relative">
        {/* red margin line */}
        <div
          className="absolute top-0 bottom-0 w-px bg-lab-accent opacity-40 pointer-events-none"
          style={{ left: 30 }}
        />

        {/* Header */}
        <div className="px-12 pt-8 pb-3 sticky top-0 z-10 lab-paper">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-lab-muted">
                § 3 · Result tables
              </p>
              <h1 className="text-[28px] font-bold text-lab-ink leading-tight tracking-tight">
                Results &amp; Analysis
              </h1>
              <p className="font-hand text-[18px] text-lab-accent mt-0.5">
                n = 3 seeds · all six adversarial benchmarks
              </p>
            </div>
            <div className="font-mono text-[10px] text-lab-muted text-right leading-relaxed">
              DATE 2026-04-28 · 14:02 UTC
              <br />
              <span className="text-lab-green">●</span> CRUSH v1.0 · live
            </div>
          </div>
          {/* double rule */}
          <div className="h-[2px] bg-lab-ink mt-3" />
          <div className="h-px bg-lab-ink opacity-60 mt-[2px]" />
        </div>

        <div className="px-12 pb-16 pt-6 space-y-9">
          {/* Stat cards — taped index cards */}
          <div className="grid grid-cols-4 gap-5">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="relative border-[1.5px] border-lab-ink bg-lab-paper2/90 px-5 py-4 lab-shadow"
                style={{ transform: `rotate(${s.rot}deg)` }}
              >
                <span className="lab-tape" />
                <p className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-lab-muted">
                  {s.label}
                </p>
                <p className="font-serif text-[36px] font-bold text-lab-ink leading-none mt-1.5 tracking-tight">
                  {s.value}
                  <span className="text-[16px] font-normal text-lab-muted">
                    {s.unit}
                  </span>
                </p>
                <p className="font-hand text-[15px] text-lab-accent mt-1">
                  {s.note}
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Radar */}
            <FigureFrame
              num="1"
              caption="Per-attack defense rate. CRUSH (red) dominates baseline (dashed) on all six axes; gap is largest on AutoDAN and Jailbreak suites."
              handnote="all 6 axes ↑"
            >
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={INK} strokeOpacity={0.3} />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fill: INK, fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                  />
                  <Radar
                    name="CRUSH"
                    dataKey="CRUSH"
                    stroke={ACCENT}
                    fill={ACCENT}
                    fillOpacity={0.18}
                    strokeWidth={1.5}
                  />
                  <Radar
                    name="Baseline"
                    dataKey="Baseline"
                    stroke={INK}
                    fill={INK}
                    fillOpacity={0.05}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: 11,
                      color: INK,
                      fontFamily: 'IBM Plex Mono',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </FigureFrame>

            {/* Bar */}
            <FigureFrame
              num="2"
              caption="Method comparison on white-box ASR. Lower is better. CRUSH attains 3.53%, a 3.2× improvement over NPO."
              handnote="3.2× over NPO! ✓"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} layout="vertical">
                  <XAxis
                    type="number"
                    tick={{ fill: MUTED, fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                    stroke={INK}
                    strokeOpacity={0.5}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: INK, fontSize: 11, fontFamily: 'Source Serif 4' }}
                    width={110}
                    stroke={INK}
                    strokeOpacity={0.5}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fbfaf2',
                      border: `1.5px solid ${INK}`,
                      borderRadius: 0,
                      fontFamily: 'IBM Plex Mono',
                      fontSize: 11,
                    }}
                    labelStyle={{ color: INK }}
                  />
                  <Bar dataKey="value">
                    {barData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.ours ? ACCENT : INK}
                        fillOpacity={entry.ours ? 0.85 : 0.65}
                        stroke={INK}
                        strokeWidth={0.5}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </FigureFrame>
          </div>

          {/* Table */}
          <div>
            <div className="relative border-[1.5px] border-lab-ink bg-lab-paper2/90 lab-shadow">
              <div className="h-[2px] bg-lab-ink" />
              <div className="grid grid-cols-[1.6fr_repeat(5,1fr)] px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase text-lab-muted">
                <span>Benchmark</span>
                <span className="text-right">Baseline</span>
                <span className="text-right">NPO</span>
                <span className="text-right">GD</span>
                <span className="text-right">RMU</span>
                <span className="text-right text-lab-accent">CRUSH</span>
              </div>
              <div className="h-px bg-lab-ink opacity-70" />
              {tableData.map((row, i) => {
                const vals = [row.baseline, row.npo, row.gd, row.rmu, row.crush]
                const min = Math.min(...vals)
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-[1.6fr_repeat(5,1fr)] px-4 py-2.5 text-[13px] text-lab-ink ${
                      i < tableData.length - 1
                        ? 'border-b border-lab-ink/50'
                        : ''
                    }`}
                  >
                    <span className="font-serif">{row.name}</span>
                    {vals.map((v, j) => (
                      <span
                        key={j}
                        className={`text-right font-mono ${
                          v === min
                            ? 'text-lab-accent font-bold relative'
                            : 'text-lab-ink'
                        }`}
                      >
                        {v.toFixed(2)}
                      </span>
                    ))}
                  </div>
                )
              })}
              <div className="h-[2px] bg-lab-ink" />
            </div>
            <p className="lab-caption mt-2">
              Table 1 · Detailed per-benchmark ASR (%). Lower is better.{' '}
              <span className="text-lab-accent">Red</span> indicates best in
              column.
            </p>
          </div>

          {/* footer rule + page number */}
          <div className="pt-4">
            <div className="h-px bg-lab-ink opacity-60" />
            <div className="h-[2px] bg-lab-ink mt-[2px]" />
            <p className="font-hand text-[18px] text-lab-accent text-center mt-3">
              — entry no. 048 · p. 7 of 18 —
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

function FigureFrame({
  num,
  caption,
  handnote,
  children,
}: {
  num: string
  caption: string
  handnote: string
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <div className="border-[1.5px] border-lab-ink bg-lab-paper2/90 p-4 lab-shadow">
        {children}
      </div>
      <p className="lab-caption mt-2">
        <strong className="not-italic text-lab-ink">Fig. {num}.</strong>{' '}
        {caption}
      </p>
      <span className="absolute -right-2 top-2 font-hand text-[16px] text-lab-accent rotate-[4deg] max-w-[160px] leading-tight">
        ← {handnote}
      </span>
    </div>
  )
}
