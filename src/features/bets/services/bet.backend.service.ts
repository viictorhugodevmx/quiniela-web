import { frontendEnv } from '../../../config/env';
import { getAuthToken } from '../../auth/services/auth.storage';
import type {
  Bet,
  BetService,
  CreateBetInput,
  CreateBetResponse,
  MyBetResponse,
  PublicBet,
  PublicBetsResponse
} from '../bet.types';

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || 'Request failed';
  } catch {
    return 'Request failed';
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
}

export const betBackendService: BetService = {
  async listPublicBets(): Promise<PublicBet[]> {
    const response = await fetch(`${frontendEnv.apiUrl}/api/bets`);

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const data = (await response.json()) as PublicBetsResponse;

    return data.bets;
  },

  async getMyBet(): Promise<Bet | null> {
    const token = getAuthToken();

    if (!token) {
      return null;
    }

    const response = await fetch(`${frontendEnv.apiUrl}/api/bets/me`, {
      headers: getAuthHeaders()
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const data = (await response.json()) as MyBetResponse;

    return data.bet;
  },

  async createBet(input: CreateBetInput): Promise<Bet> {
    const response = await fetch(`${frontendEnv.apiUrl}/api/bets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const data = (await response.json()) as CreateBetResponse;

    return data.bet;
  }
};
