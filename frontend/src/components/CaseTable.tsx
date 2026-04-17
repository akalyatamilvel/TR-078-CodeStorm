import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { CaseResult } from '../types'
import PriorityBar from './PriorityBar'
import UndertrialBadge from './UndertrialBadge'

interface CaseTableProps {
  cases: CaseResult[]
  searchQuery?: string
}

const getClassBadge = (cls: string): string => {
  const map: Record<string, string> = {
    'Criminal (Major)': 'bg-red-100 text-red-800 border-red-300',
    'Criminal (Minor)': 'bg-orange-100 text-orange-800 border-orange-300',
    'Fast Track': 'bg-purple-100 text-purple-800 border-purple-300',
    'Bail Eligible': 'bg-blue-100 text-blue-800 border-blue-300',
    Civil: 'bg-green-100 text-green-800 border-green-300',
  }
  return map[cls] || 'bg-gray-100 text-gray-700 border-gray-300'
}

const getPriorityRowBg = (score: number): string => {
  if (score >= 75) return 'bg-red-50 hover:bg-red-100'
  if (score >= 50) return 'bg-orange-50 hover:bg-orange-100'
  return 'hover:bg-blue-50'
}

const CaseTable: React.FC<CaseTableProps> = ({ cases, searchQuery = '' }) => {
  const navigate = useNavigate()

  const filtered = cases.filter((c) => {
    const q = searchQuery.toLowerCase()
    return (
      c.case_id.toLowerCase().includes(q) ||
      c.ipc_section.toLowerCase().includes(q) ||
      c.classification.toLowerCase().includes(q) ||
      (c.flag || '').toLowerCase().includes(q)
    )
  })

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No cases found matching your search.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="gov-table">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>IPC Section</th>
            <th>Classification</th>
            <th>Priority Score</th>
            <th>Detention (mo)</th>
            <th>Expected (mo)</th>
            <th>Flag</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr
              key={c.case_id}
              className={getPriorityRowBg(c.priority_score)}
              onClick={() => navigate('/results', { state: { result: c } })}
            >
              <td className="font-mono font-semibold text-gov-blue text-xs">{c.case_id}</td>
              <td className="font-mono text-xs">{c.ipc_section}</td>
              <td>
                <span className={`badge border ${getClassBadge(c.classification)}`}>
                  {c.classification}
                </span>
              </td>
              <td className="w-40">
                <PriorityBar score={c.priority_score} showLabel={false} />
                <span className="text-xs text-gray-600 mt-0.5 block">{c.priority_score}</span>
              </td>
              <td className="text-center">{c.detention_duration}</td>
              <td className="text-center">{c.expected_sentence}</td>
              <td>
                <UndertrialBadge flag={c.flag} />
              </td>
              <td>
                <button
                  className="text-gov-blue text-xs font-semibold hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate('/results', { state: { result: c } })
                  }}
                >
                  View →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CaseTable
