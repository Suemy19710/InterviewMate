import React from 'react'
import { AlertCircle } from 'lucide-react'

export const ErrorMessage = ({ message }) => {
  if (!message) return null

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
      <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
      <p className="text-red-700 text-sm">{message}</p>
    </div>
  )
}