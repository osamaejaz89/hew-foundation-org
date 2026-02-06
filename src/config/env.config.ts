interface EnvConfig {
  /** Server root [ip]:[port] for static assets (e.g. /uploads) */
  API_URL: string;
  /** Base for API calls: [ip]:[port]/api */
  API_BASE_URL: string;
}

const raw = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/?$/, '');
const serverRoot = raw.endsWith('/api') ? raw.replace(/\/api\/?$/, '') : raw;
export const env: EnvConfig = {
  API_URL: serverRoot,
  API_BASE_URL: `${serverRoot}/api`,
}; 