import {useState} from 'react'
import {resumeService} from '../api/services/resumeService';

export const useResumeMatcher = () => {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const matchResumes = async(jdText, keywords, topK) => {
        if (!jdText || !keywords) {
            setError('Please fill in all required field');
            return
        }

        setLoading(true)
        setError('')
        setResults([])

        try{
            const data = await resumeService.matchResumes(jdText, keywords, topK)
            setResults(data)
            return data
        }
        catch(error)
        {const errorMessage = `Failed to fetch results: ${err.message}. Make sure your FastAPI server is running on http://localhost:8000`
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false) 
        }
    }
    const reset = () => {
        setResults([])
        setError('')
    }
    return {
        results, 
        loading, 
        error, 
        matchResumes, 
        reset,
    }
}