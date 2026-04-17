import React from 'react'

const UndertrialBadge: React.FC<{ flag: string | null }> = ({ flag }) => {
  if (!flag) return null

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-bold bg-red-100 text-red-700 border border-red-300">
      <span className="w-2 h-2 rounded-full bg-red-600 animate-blink inline-block"></span>
      {flag}
    </span>
  )
}

export default UndertrialBadge
