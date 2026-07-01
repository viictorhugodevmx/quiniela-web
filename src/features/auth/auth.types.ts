export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export interface AuthService {
  register: (input: RegisterInput) => Promise<AuthUser>;
  login: (input: LoginInput) => Promise<LoginResult>;
  me: () => Promise<AuthUser | null>;
  logout: () => void;
}
