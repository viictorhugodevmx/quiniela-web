import { frontendEnv } from '../../../config/env';
import type { BetService } from '../bet.types';
import { betBackendService } from './bet.backend.service';
import { betMockService } from './bet.mock.service';

export const betService: BetService =
  frontendEnv.apiMode === 'backend' ? betBackendService : betMockService;
