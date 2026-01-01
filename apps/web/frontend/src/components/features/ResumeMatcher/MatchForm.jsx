import React, { useState } from 'react'
import { Search } from 'lucide-react'
import {Button} from '../../../components/common/Button'
import { Input, TextArea } from '../../../components/common/Input'
import { Slider } from '../../../components/common/Slider'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage'
import { APP_CONFIG } from '../../../config/constants'

export const MatchForm = ({ onSubmit, loading, error }) => {
  const [jdText, setJdText] = useState('')
  const [keywords, setKeywords] = useState('')
  const [topK, setTopK] = useState(APP_CONFIG.DEFAULT_TOP_K)

  const handleSubmit = () => {
    onSubmit({ jdText, keywords, topK })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-black text-sm">
      <div className="space-y-6">
        <TextArea
          label="Job Description"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the job description here..."
          rows={6}
          required
        />

        <Input
          label="Keywords (comma-separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., Python, Machine Learning, FastAPI, React"
          required
        />

        <Slider
          label="Number of Results"
          value={topK}
          onChange={(e) => setTopK(parseInt(e.target.value))}
          min={APP_CONFIG.MIN_TOP_K}
          max={APP_CONFIG.MAX_TOP_K}
        />

        <Button
          onClick={handleSubmit}
          disabled={!jdText || !keywords}
          loading={loading}
          icon={Search}
        >
          Find Matching Candidates
        </Button>

        <ErrorMessage message={error} />
      </div>
    </div>
  )
}