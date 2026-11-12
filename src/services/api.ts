declare global {
  interface Window { APP_CONFIG?: { API_URL?: string } }
}

export const API_URL = window.APP_CONFIG?.API_URL || import.meta.env.VITE_API_URL || 'https://localhost:7193'
