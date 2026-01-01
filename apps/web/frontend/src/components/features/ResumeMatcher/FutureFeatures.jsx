import React from 'react'

const features = [
  'User authentication & account management',
  'Upload your own job descriptions and resumes',
  'Resume improvement suggestions powered by AI',
  'Save and compare multiple job searches',
]

export const FutureFeatures = () => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        🚀 Coming Soon
      </h3>
      <ul className="space-y-2 text-sm text-gray-600">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}