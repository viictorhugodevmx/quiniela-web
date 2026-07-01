export type ApiMode = 'mock' | 'backend';

interface FrontendEnv {
  apiMode: ApiMode;
  apiUrl: string;
}

function getApiMode(value: unknown): ApiMode {
  return value === 'backend' ? 'backend' : 'mock';
}

export const frontendEnv: FrontendEnv = {
  apiMode: getApiMode(import.meta.env.VITE_API_MODE),
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000'
};
