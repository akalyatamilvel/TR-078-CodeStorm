import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import axiosClient from '../api/axiosClient'
import type { CaseResult } from '../types'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#c0392b', '#e67e22', '#f39c12', '#27ae60', '#1e5799', '#9b59b6']

const Analytics: React.FC = () => {
  const [cases, setCases] = useState<CaseResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axiosClient.get<{ total: number; cases: CaseResult[] }>('/cases/sorted')
        setCases(res.data.cases)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [])

  // ── Chart Data Derivations ──────────────────────────────────────────────

  // Bar chart: top 10 priority cases
  const barData = cases.slice(0, 10).map((c) => ({
    name: c.case_id.replace('CC-2024-', '#'),
    score: c.priority_score,
    fill: c.priority_score >= 75 ? '#c0392b' : c.priority_score >= 50 ? '#e67e22' : '#1e5799',
  }))

  // Pie chart: classification distribution
  const classCounts: Record<string, number> = {}
  cases.forEach((c) => {
    classCounts[c.classification] = (classCounts[c.classification] || 0) + 1
  })
  const pieData = Object.entries(classCounts).map(([name, value]) => ({ name, value }))

  // Line chart: priority trend (ordered by case sequence)
  const lineData = [...cases]
    .sort((a, b) => a.case_id.localeCompare(b.case_id))
    .map((c, i) => ({
      index: `#${i + 1}`,
      score: c.priority_score,
      detention: c.detention_duration,
    }))

  // Score buckets for bar2
  const buckets = [
    { range: '0-24 (Low)', count: cases.filter((c) => c.priority_score < 25).length },
    { range: '25-49 (Medium)', count: cases.filter((c) => c.priority_score >= 25 && c.priority_score < 50).length },
    { range: '50-74 (Med-High)', count: cases.filter((c) => c.priority_score >= 50 && c.priority_score < 75).length },
    { range: '75-100 (High)', count: cases.filter((c) => c.priority_score >= 75).length },
  ]

  const undertrialCount = cases.filter((c) => c.flag).length
  const avgScore = cases.length > 0 ? (cases.reduce((s, c) => s + c.priority_score, 0) / cases.length).toFixed(1) : '—'
  const maxScore = cases.length > 0 ? Math.max(...cases.map((c) => c.priority_score)) : 0

  return (
    <Layout>
      <h2 className="text-xl font-bold text-gov-navy mb-5">📊 Analytics & Insights</h2>

      {loading ? (
        <LoadingSpinner message="Loading analytics..." />
      ) : error ? (
        <div className="text-red-600 text-sm p-4 bg-red-50 border border-red-300 rounded-sm">⚠ {error}</div>
      ) : (
        <>
          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Cases', value: cases.length, color: 'text-gov-navy' },
              { label: 'Avg Priority Score', value: avgScore, color: 'text-orange-600' },
              { label: 'Max Score', value: maxScore, color: 'text-red-600' },
              { label: 'Undertrial Flags', value: undertrialCount, color: 'text-red-700' },
            ].map((kpi) => (
              <div key={kpi.label} className="gov-card p-4 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide">{kpi.label}</p>
                <p className={`text-3xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar: Top 10 Priority Cases */}
            <div className="gov-card p-5">
              <h3 className="section-title">Top 10 Priority Cases</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [`${v}`, 'Priority Score']}
                    contentStyle={{ fontSize: 12, borderRadius: 4 }}
                  />
                  <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie: Classification Distribution */}
            <div className="gov-card p-5">
              <h3 className="section-title">Case Classification Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    dataKey="value"
                    label={({ name, percent }) => `${name.split(' ').slice(-1)[0]} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 12 }} />
                  <Legend iconSize={12} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line: Priority Score Trend */}
            <div className="gov-card p-5">
              <h3 className="section-title">Priority Score Trend (All Cases)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={lineData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="index" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#1e5799"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Priority Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="detention"
                    stroke="#e67e22"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Detention (mo)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar: Score Buckets */}
            <div className="gov-card p-5">
              <h3 className="section-title">Cases by Priority Level</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={buckets} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 9 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="count" name="Number of Cases" radius={[3, 3, 0, 0]}>
                    {buckets.map((_, i) => (
                      <Cell key={i} fill={['#27ae60', '#f39c12', '#e67e22', '#c0392b'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Undertrial summary */}
          {undertrialCount > 0 && (
            <div className="mt-6 gov-card p-5 border-l-4 border-red-600 bg-red-50">
              <h3 className="section-title text-red-700">⚠ Undertrial Overstay Alert</h3>
              <p className="text-sm text-red-800">
                <strong>{undertrialCount}</strong> case(s) have detention duration exceeding their expected sentence.
                These cases require <strong>immediate judicial review</strong>.
              </p>
              <ul className="mt-3 space-y-1">
                {cases.filter((c) => c.flag).map((c) => (
                  <li key={c.case_id} className="text-xs text-red-700 font-mono">
                    • {c.case_id} — Detained {c.detention_duration} mo vs Expected {c.expected_sentence} mo
                    (Score: {c.priority_score})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}

export default Analytics
