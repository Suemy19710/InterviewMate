
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
}