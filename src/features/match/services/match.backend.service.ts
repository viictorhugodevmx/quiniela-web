import { frontendEnv } from '../../../config/env';
import type { MatchConfig, MatchConfigResponse, MatchService } from '../match.types';

export const matchBackendService: MatchService = {
  async getMatchConfig(): Promise<MatchConfig> {
    const response = await fetch(`${frontendEnv.apiUrl}/api/match`);

    if (!response.ok) {
      throw new Error('MATCH_CONFIG_REQUEST_FAILED');
    }

    const data = (await response.json()) as MatchConfigResponse;

    return data.match;
  }
};
