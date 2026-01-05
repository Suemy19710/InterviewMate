import React from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export const AISuggestions = ({ suggestions, provider, isLoading }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestions)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="ml-4 text-gray-600">Generating AI suggestions...</p>
        </div>
      </div>
    )
  }

  if (!suggestions) return null

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 border-2 border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={24} />
          <h3 className="text-xl font-bold text-gray-800">
            AI-Powered Improvement Suggestions
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
            Powered by {provider}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="text-green-600" size={18} />
            ) : (
              <Copy className="text-gray-600" size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg p-6 te">
        <div 
          className="prose prose-sm max-w-none"
          style={{ 
            whiteSpace: 'pre-wrap',
            lineHeight: '1.8'
          }}
        >
          {suggestions.split('\n').map((line, index) => {
            // Bold headers (lines starting with **)
            if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
              return (
                <h4 key={index} className="font-bold text-lg text-gray-800 mt-4 mb-2">
                  {line.replace(/\*\*/g, '')}
                </h4>
              )
            }
            // Bold inline text
            else if (line.includes('**')) {
              const parts = line.split(/(\*\*.*?\*\*)/)
              return (
                <p key={index} className="mb-2">
                  {parts.map((part, i) => 
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong key={i}>{part.replace(/\*\*/g, '')}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              )
            }
            // Bullet points
            else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
              return (
                <li key={index} className="ml-4 mb-1 text-gray-700">
                  {line.replace(/^[-•]\s*/, '')}
                </li>
              )
            }
            // Numbered lists
            else if (/^\d+\./.test(line.trim())) {
              return (
                <p key={index} className="mb-2 font-medium text-gray-800">
                  {line}
                </p>
              )
            }
            // Regular paragraphs
            else if (line.trim()) {
              return (
                <p key={index} className="mb-2 text-gray-700">
                  {line}
                </p>
              )
            }
            // Empty lines
            return <br key={index} />
          })}
        </div>
      </div>

      {/* Footer Tip */}
      <div className="mt-4 p-3 bg-purple-100 rounded-lg">
        <p className="text-sm text-purple-800">
          💡 <strong>Pro Tip:</strong> Implement these suggestions one by one and 
          re-run the analysis to see your improved match score!
        </p>
      </div>
    </div>
  )
}