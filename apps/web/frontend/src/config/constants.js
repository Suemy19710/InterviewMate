export const API_CONFIG = {
    BASE_URL: import.meta.env.API_BASE_URL || 'http://localhost:8000',
    ENDPOINTS: {
        MATCH_JD: '/match_jd',
    }
}

export const APP_CONFIG = {
    DEFAULT_TOP_K: 3,
    MIN_TOP_K: 1,
    MAX_TOP_K: 50,
}
