export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
    ENDPOINTS: {
        MATCH_JD: '/match-jd',
    }
}

export const APP_CONFIG = {
    DEFAULT_TOP_K: 3,
    MIN_TOP_K: 1,
    MAX_TOP_K: 50,
}
