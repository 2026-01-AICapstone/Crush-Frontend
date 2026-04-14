'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell,
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
  { name: 'CRUSH', value: 3.53, color: '#7c6ff7' },
  { name: 'NPO', value: 11.47, color: '#334' },
  { name: 'GD', value: 12.15, color: '#334' },
  { name: 'RMU', value: 21.38, color: '#334' },
  { name: 'TAR', value: 55.4, color: '#334' },
]

const tableData = [
  { name: 'Black-box 공격', baseline: 42.1, crush: 2.78, ref: '전국 평균 41%' },
  { name: 'White-box 공격', baseline: 38.5, crush: 3.53, ref: '전국 평균 37%' },
  { name: 'OOD 일반화', baseline: 61.2, crush: 99.2, ref: 'ProfBing 기준' },
  { name: 'WildGuardTest', baseline: 45.0, crush: 100.0, ref: '전 유형 1위' },
]

const statCards = [
  { label: 'Black-box ASR', value: '2.78%', sub: '↓ 10.87%p vs 2위 NPO', color: 'text-crush-purple' },
  { label: 'White-box ASR', value: '3.53%', sub: '↓ 7.62%p vs 전체 평균', color: 'text-crush-purple' },
  { label: 'Profiling Defense', value: '99.2%', sub: 'Profiling Attack 기준', color: 'text-crush-green' },
  { label: 'WildGuardTest', value: '전부 #1', sub: '전 유형 1위', color: 'text-crush-yellow' },
]

export default function BenchmarkPage() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 overflow-y-auto bg-bg-primary">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-crush-border bg-bg-secondary/50 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">BENCHMARK RESULTS</h1>
            <div className="flex gap-4 mt-1 text-xs text-gray-600">
              <span>Baseline: 7B</span>
              <span>·</span>
              <span>Attack Success Rate (%)</span>
              <span>·</span>
              <span>낮을수록 안전</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-crush-green animate-pulse" />
            <span className="text-crush-green font-mono">CRUSH v1.0 · Live</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className="bg-bg-card rounded-xl p-5 border border-crush-border">
                <p className="text-xs text-gray-600 mb-2">{card.label}</p>
                <p className={`text-3xl font-bold font-mono ${card.color}`}>{card.value}</p>
                <p className="text-xs text-gray-500 mt-2">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-4">
            {/* Radar */}
            <div className="bg-bg-card rounded-xl p-5 border border-crush-border">
              <p className="text-sm font-semibold text-gray-300 mb-4">공격 유형별 방어 성능 비교</p>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2a2b40" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: '#8b8fa8', fontSize: 11 }} />
                  <Radar name="CRUSH" dataKey="CRUSH" stroke="#7c6ff7" fill="#7c6ff7" fillOpacity={0.3} />
                  <Radar name="Baseline" dataKey="Baseline" stroke="#444" fill="#444" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#8b8fa8' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar */}
            <div className="bg-bg-card rounded-xl p-5 border border-crush-border">
              <p className="text-sm font-semibold text-gray-300 mb-4">방법론별 ASR 비교 (낮을수록 우수)</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#8b8fa8', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#8b8fa8', fontSize: 12 }} width={60} />
                  <Tooltip
                    contentStyle={{ background: '#1a1b26', border: '1px solid #2a2b40', borderRadius: 8 }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-bg-card rounded-xl border border-crush-border overflow-hidden">
            <div className="px-5 py-4 border-b border-crush-border">
              <p className="text-sm font-semibold text-gray-300">세부 벤치마크 결과</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-600 uppercase border-b border-crush-border">
                  <th className="text-left px-5 py-3">공격 유형</th>
                  <th className="text-right px-5 py-3">Baseline ASR</th>
                  <th className="text-right px-5 py-3">CRUSH ASR</th>
                  <th className="text-right px-5 py-3">비고</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} className="border-b border-crush-border/50 hover:bg-bg-hover transition-colors">
                    <td className="px-5 py-3.5 text-gray-200">{row.name}</td>
                    <td className="px-5 py-3.5 text-right text-risk-high font-mono">{row.baseline}%</td>
                    <td className="px-5 py-3.5 text-right text-crush-green font-mono font-bold">{row.crush}%</td>
                    <td className="px-5 py-3.5 text-right text-gray-600 text-xs">{row.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
