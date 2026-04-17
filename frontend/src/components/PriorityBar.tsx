import React from 'react'

interface PriorityBarProps {
  score: number
  showLabel?: boolean
}

const getColor = (score: number): string => {
  if (score >= 75) return '#c0392b'   // Red – High
  if (score >= 50) return '#e67e22'   // Orange – Medium-High
  if (score >= 25) return '#f39c12'   // Yellow – Medium
  return '#27ae60'                     // Green – Low
}

const getLabel = (score: number): string => {
  if (score >= 75) return 'HIGH'
  if (score >= 50) return 'MEDIUM-HIGH'
  if (score >= 25) return 'MEDIUM'
  return 'LOW'
}

const PriorityBar: React.FC<PriorityBarProps> = ({ score, showLabel = true }) => {
  const color = getColor(score)
  const label = getLabel(score)

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-500">Priority Score</span>
          <span className="text-sm font-bold" style={{ color }}>
            {score} / 100 — {label}
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full priority-fill"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default PriorityBar
