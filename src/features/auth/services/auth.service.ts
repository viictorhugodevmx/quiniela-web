import { frontendEnv } from '../../../config/env';
import type { AuthService } from '../auth.types';
import { authBackendService } from './auth.backend.service';
import { authMockService } from './auth.mock.service';

export const authService: AuthService =
  frontendEnv.apiMode === 'backend' ? authBackendService : authMockService;
