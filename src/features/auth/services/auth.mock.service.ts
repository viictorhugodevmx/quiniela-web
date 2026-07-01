import type { AuthService, AuthUser, LoginInput, LoginResult, RegisterInput } from '../auth.types';
import { clearAuthSession, getStoredUser, saveAuthSession } from './auth.storage';

const mockUsers: AuthUser[] = [
  {
    id: 'mock-user-1',
    name: 'Victor Hugo',
    email: 'victor@app0.com',
    role: 'USER'
  }
];

function createMockToken(user: AuthUser): string {
  return `mock-token-${user.id}`;
}

export const authMockService: AuthService = {
  async register(input: RegisterInput): Promise<AuthUser> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name || !email || input.password.length < 6) {
      throw new Error('Datos inválidos para registro');
    }

    const existingUser = mockUsers.find((user) => user.email === email);

    if (existingUser) {
      throw new Error('El correo ya está registrado');
    }

    const user: AuthUser = {
      id: `mock-user-${Date.now()}`,
      name,
      email,
      role: 'USER'
    };

    mockUsers.push(user);

    return user;
  },

  async login(input: LoginInput): Promise<LoginResult> {
    const email = input.email.trim().toLowerCase();

    const user = mockUsers.find((item) => item.email === email);

    if (!user || input.password.length < 6) {
      throw new Error('Credenciales inválidas');
    }

    const token = createMockToken(user);

    saveAuthSession(token, user);

    return {
      token,
      user
    };
  },

  async me(): Promise<AuthUser | null> {
    return getStoredUser();
  },

  logout(): void {
    clearAuthSession();
  }
};
