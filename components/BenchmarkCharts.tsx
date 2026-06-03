'use client'

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

const INK = '#1d2536'
const ACCENT = '#b04a2f'
const MUTED = '#5b6275'

export default function BenchmarkCharts() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <FigureFrame
        num="1"
        caption="Per-attack defense rate. CRUSH dominates baseline on all six axes."
        handnote="all 6 axes up"
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

      <FigureFrame
        num="2"
        caption="Method comparison on white-box ASR. Lower is better."
        handnote="3.2x over NPO"
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
              {barData.map((entry) => (
                <Cell
                  key={entry.name}
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
        <strong className="not-italic text-lab-ink">Fig. {num}.</strong> {caption}
      </p>
      <span className="absolute -right-2 top-2 font-hand text-[16px] text-lab-accent rotate-[4deg] max-w-[160px] leading-tight">
        {handnote}
      </span>
    </div>
  )
}
