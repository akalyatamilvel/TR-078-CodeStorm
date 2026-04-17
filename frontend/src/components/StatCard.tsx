import React from 'react'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string      // Tailwind bg class
  textColor?: string
  subtitle?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, textColor = 'text-white', subtitle }) => {
  return (
    <div className={`${color} rounded-sm p-5 shadow-md flex items-center gap-4 text-white`}>
      <div className="text-4xl opacity-90">{icon}</div>
      <div>
        <p className={`text-sm font-medium opacity-90 ${textColor}`}>{title}</p>
        <p className={`text-3xl font-bold mt-0.5 ${textColor}`}>{value}</p>
        {subtitle && <p className={`text-xs mt-1 opacity-75 ${textColor}`}>{subtitle}</p>}
      </div>
    </div>
  )
}

export default StatCard
