interface EnvConfig {
  API_URL: string;
}

export const env: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
}; 