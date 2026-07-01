import { frontendEnv } from '../../../config/env';
import type { AuthService, AuthUser, LoginInput, LoginResult, RegisterInput } from '../auth.types';
import { clearAuthSession, getAuthToken, saveAuthSession } from './auth.storage';

interface RegisterResponse {
  message: string;
  user: AuthUser;
}

interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

interface MeResponse {
  user: AuthUser;
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || 'Request failed';
  } catch {
    return 'Request failed';
  }
}

export const authBackendService: AuthService = {
  async register(input: RegisterInput): Promise<AuthUser> {
    const response = await fetch(`${frontendEnv.apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const data = (await response.json()) as RegisterResponse;

    return data.user;
  },

  async login(input: LoginInput): Promise<LoginResult> {
    const response = await fetch(`${frontendEnv.apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const data = (await response.json()) as LoginResponse;

    saveAuthSession(data.token, data.user);

    return {
      token: data.token,
      user: data.user
    };
  },

  async me(): Promise<AuthUser | null> {
    const token = getAuthToken();

    if (!token) {
      return null;
    }

    const response = await fetch(`${frontendEnv.apiUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      clearAuthSession();
      return null;
    }

    const data = (await response.json()) as MeResponse;

    return data.user;
  },

  logout(): void {
    clearAuthSession();
  }
};
