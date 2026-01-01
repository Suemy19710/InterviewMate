import React from 'react'
import { useResumeMatcher } from '../../hooks/useResumeMatcher'
import { MatchForm, ResultsTable, FutureFeatures } from '../../components/features/ResumeMatcher'

export const ResumeMatcherPage = () => {
  const { results, loading, error, matchResumes } = useResumeMatcher()

  const handleSubmit = ({ jdText, keywords, topK }) => {
    matchResumes(jdText, keywords, topK)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Resume Matcher
          </h1>
          <p className="text-gray-600">
            Match job descriptions with the best candidate resumes using AI
          </p>
        </div>

        {/* Form */}
        <MatchForm 
          onSubmit={handleSubmit} 
          loading={loading} 
          error={error} 
        />

        {/* Results */}
        <ResultsTable results={results} />

        {/* Future Features */}
        <FutureFeatures />
      </div>
    </div>
  )
}

export default ResumeMatcherPage