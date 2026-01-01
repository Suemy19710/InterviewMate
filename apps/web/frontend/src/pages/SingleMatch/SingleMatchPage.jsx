import React, { useState } from 'react'
import { FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { TextArea } from '@/components/common/Input'
import { FileUpload } from '@/components/common/FileUpload'
import { ErrorMessage } from '../../components/features/ErrorMessage/ErrorMessage'
import { resumeService } from '@/api/services/resumeService'

export const SingleMatchPage = () => {
  const [resumeFile, setResumeFile] = useState(null)
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = async () => {
    if (!resumeFile || !jdText) {
      setError('Please upload a resume and enter a job description')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await resumeService.singleMatch(resumeFile, jdText)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResumeFile(null)
    setJdText('')
    setResult(null)
    setError('')
  }

  const getResultIcon = (color) => {
    switch (color) {
      case 'green':
        return <CheckCircle className="text-green-600" size={48} />
      case 'yellow':
        return <AlertTriangle className="text-yellow-600" size={48} />
      case 'red':
        return <XCircle className="text-red-600" size={48} />
      default:
        return null
    }
  }

  const getResultBgColor = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 border-green-200'
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200'
      case 'red':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Single Resume Matcher
          </h1>
          <p className="text-gray-600">
            Upload a resume and compare it against a job description
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6 text-black text-sm">
            {/* Left: File Upload */}
            <div>
              <FileUpload
                file={resumeFile}
                onFileSelect={setResumeFile}
                onFileRemove={() => setResumeFile(null)}
                label="Upload Resume (PDF)"
                disabled={loading}
              />
            </div>

            {/* Right: Job Description */}
            <div>
              <TextArea
                label="Job Description"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job description here..."
                rows={8}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <div className="flex-1">
              <Button
                onClick={handleSubmit}
                disabled={!resumeFile || !jdText}
                loading={loading}
                icon={FileText}
              >
                Analyze Match
              </Button>
            </div>
            {result && (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
              >
                Reset
              </button>
            )}
          </div>

          <ErrorMessage message={error} />
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className={`rounded-lg shadow-lg p-8 border-2 ${getResultBgColor(result.result_color)}`}>
              <div className="flex items-center gap-6">
                <div>{getResultIcon(result.result_color)}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {result.result}
                  </h2>
                  <p className="text-gray-600">
                    Resume: <span className="font-medium">{result.filename}</span>
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-800">
                    {result.match_score}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Match Score</p>
                </div>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Matching Skills */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-green-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">
                    Matching Skills ({result.fit_count})
                  </h3>
                </div>
                {result.fit_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.fit_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No matching skills found</p>
                )}
              </div>

              {/* Missing Skills */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="text-red-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">
                    Missing Skills ({result.missing_count})
                  </h3>
                </div>
                {result.missing_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">All required skills present!</p>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Detailed Analysis
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.total_jd_skills}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Total Skills Required
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {result.fit_count}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Skills Matched</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {result.missing_count}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Skills Missing</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Skills Coverage</span>
                  <span>
                    {result.total_jd_skills > 0
                      ? Math.round((result.fit_count / result.total_jd_skills) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        result.total_jd_skills > 0
                          ? (result.fit_count / result.total_jd_skills) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleMatchPage