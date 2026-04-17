import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import PriorityBar from '../components/PriorityBar'
import UndertrialBadge from '../components/UndertrialBadge'
import type { CaseResult } from '../types'

const getClassColor = (cls: string): string => {
  const map: Record<string, string> = {
    'Criminal (Major)': 'bg-red-100 border-red-400 text-red-800',
    'Criminal (Minor)': 'bg-orange-100 border-orange-400 text-orange-800',
    'Fast Track': 'bg-purple-100 border-purple-400 text-purple-800',
    'Bail Eligible': 'bg-blue-100 border-blue-400 text-blue-800',
    Civil: 'bg-green-100 border-green-400 text-green-800',
  }
  return map[cls] || 'bg-gray-100 border-gray-400 text-gray-800'
}

const ResultPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result as CaseResult | undefined

  if (!result) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">No result data found.</p>
          <button onClick={() => navigate('/add-case')} className="btn-primary">
            ← Go Back to Add Case
          </button>
        </div>
      </Layout>
    )
  }

  const isHighPriority = result.priority_score >= 75
  const isUndertrial = !!result.flag

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Page title */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gov-navy">📄 Case Analysis Result</h2>
          <button onClick={() => navigate('/cases')} className="btn-secondary text-xs">
            ← Back to Cases
          </button>
        </div>

        {/* High Priority banner */}
        {isHighPriority && (
          <div className="bg-red-700 text-white text-sm font-semibold px-5 py-3 rounded-sm mb-4 flex items-center gap-3 shadow">
            <span className="text-xl">🚨</span>
            HIGH PRIORITY CASE — Requires Immediate Judicial Attention
          </div>
        )}

        {/* Case header card */}
        <div className={`gov-card p-6 mb-4 border-l-4 ${isHighPriority ? 'border-red-600' : 'border-gov-blue'}`}>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Case ID</p>
              <p className="font-mono font-bold text-gov-navy text-lg">{result.case_id}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className={`badge border px-3 py-1 text-sm font-semibold ${getClassColor(result.classification)}`}>
                {result.classification}
              </span>
              <UndertrialBadge flag={result.flag} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {[
              { label: 'IPC Section', value: result.ipc_section },
              { label: 'Detention', value: `${result.detention_duration} months` },
              { label: 'Expected Sentence', value: `${result.expected_sentence} months` },
              { label: 'Age / Gender', value: `${result.age} yrs / ${result.gender}` },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 p-3 rounded-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className="font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Score */}
        <div className="gov-card p-6 mb-4">
          <h3 className="section-title">Priority Score</h3>
          <div className="mt-2">
            <PriorityBar score={result.priority_score} showLabel />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            {[
              { range: '0 – 24', label: 'Low', color: 'bg-green-100 text-green-800 border-green-300' },
              { range: '25 – 74', label: 'Medium', color: 'bg-orange-100 text-orange-800 border-orange-300' },
              { range: '75 – 100', label: 'High', color: 'bg-red-100 text-red-800 border-red-300' },
            ].map((tier) => (
              <div key={tier.label} className={`border rounded-sm p-2 ${tier.color}`}>
                <p className="font-bold">{tier.label}</p>
                <p>{tier.range}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Undertrial Flag */}
        {isUndertrial && (
          <div className="gov-card p-6 mb-4 border-l-4 border-red-600 bg-red-50">
            <h3 className="section-title text-red-700">⚠ Undertrial Flag</h3>
            <p className="text-red-800 font-semibold">{result.flag}</p>
            <p className="text-red-700 text-sm mt-2">
              The accused has been detained for <strong>{result.detention_duration} months</strong> against an expected sentence of <strong>{result.expected_sentence} months</strong>.
              This constitutes an undertrial overstay and warrants urgent judicial review.
            </p>
          </div>
        )}

        {/* Explanation / XAI */}
        <div className="gov-card p-6 mb-4">
          <h3 className="section-title">AI Explanation (XAI)</h3>
          <ul className="space-y-2 mt-2">
            {result.explanation.map((reason, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-blue-50 border border-blue-100 p-3 rounded-sm">
                <span className="text-gov-blue font-bold mt-0.5">{i + 1}.</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="gov-card p-6 mb-6">
          <h3 className="section-title">Case Summary</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => navigate('/add-case')} className="btn-primary flex-1 py-3">
            + Analyze Another Case
          </button>
          <button onClick={() => navigate('/cases')} className="btn-secondary flex-1 py-3">
            View All Cases
          </button>
          <button onClick={() => window.print()} className="btn-secondary px-5 py-3">
            🖨 Print
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default ResultPage
