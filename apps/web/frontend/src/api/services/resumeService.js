
import { apiClient } from '../client'
import { API_CONFIG } from '../../config/constants'

export const resumeService = {
  matchResumes: async (jdText, keywords, topK) => {
    return apiClient.post(API_CONFIG.ENDPOINTS.MATCH_JD, {
      jd_text: jdText,
      keywords: keywords,
      top_k: topK,
    })
  },

  singleMatch: async (resumeFile, jdText, includeAI = false) => {
    const formData = new FormData()
    formData.append('resume', resumeFile)
    formData.append('jd_text', jdText)
    formData.append('include_ai', includeAI)

    const response = await fetch(`${API_CONFIG.BASE_URL}/single-match`, {
      method: 'POST',
      body: formData, // Don't set Content-Type, browser will set it with boundary
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to match resume')
    }

    return response.json()
  },

  getAIImprovements: async(resumeFile, jdText) => {
    const formData = new FormData()
    formData.append('resume', resumeFile)
    formData.append('jd_text', jdText)

    const response = await fetch(`${API_CONFIG.BASE_URL}/ai-improve`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok){
      const error = await response.json()
      throw new Error(error.detail || 'Failed to generate AI improvements')
    }
    return response.json()
  },

  getResumeUrl: (filename) => {
    return `${API_CONFIG.BASE_URL}/resume/${filename}`
  }
}