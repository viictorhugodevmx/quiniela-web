import { frontendEnv } from '../../../config/env';
import type { MatchService } from '../match.types';
import { matchBackendService } from './match.backend.service';
import { matchMockService } from './match.mock.service';

export const matchService: MatchService =
  frontendEnv.apiMode === 'backend' ? matchBackendService : matchMockService;
