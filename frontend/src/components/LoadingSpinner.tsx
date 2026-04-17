import React from 'react'

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Processing...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-gov-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  )
}

export default LoadingSpinner
