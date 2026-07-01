import { getStoredUser } from '../../auth/services/auth.storage';
import type { Bet, BetService, CreateBetInput, PublicBet } from '../bet.types';

const mockPublicBets: PublicBet[] = [
  {
    id: 'mock-bet-1',
    matchName: 'México vs Ecuador',
    goalHalf: 'FIRST_HALF',
    minute: 23,
    amount: 50,
    participant: {
      id: 'mock-user-1',
      name: 'Victor Hugo',
      email: 'victor@app0.com'
    }
  },
  {
    id: 'mock-bet-2',
    matchName: 'México vs Ecuador',
    goalHalf: 'FIRST_HALF',
    minute: 37,
    amount: 100,
    participant: {
      id: 'mock-user-2',
      name: 'Maricela Gonzalez',
      email: 'maricela@app0.com'
    }
  },
  {
    id: 'mock-bet-3',
    matchName: 'México vs Ecuador',
    goalHalf: 'SECOND_HALF',
    minute: 61,
    amount: 50,
    participant: {
      id: 'mock-user-3',
      name: 'Ojo del Trap',
      email: 'ojo@app0.com'
    }
  }
];

function toMyBet(publicBet: PublicBet): Bet {
  return {
    id: publicBet.id,
    userId: publicBet.participant.id,
    matchName: publicBet.matchName,
    goalHalf: publicBet.goalHalf,
    minute: publicBet.minute,
    amount: publicBet.amount
  };
}

export const betMockService: BetService = {
  async listPublicBets(): Promise<PublicBet[]> {
    return mockPublicBets;
  },

  async getMyBet(): Promise<Bet | null> {
    const user = getStoredUser();

    if (!user) {
      return null;
    }

    const publicBet = mockPublicBets.find((bet) => bet.participant.id === user.id);

    if (!publicBet) {
      return null;
    }

    return toMyBet(publicBet);
  },

  async createBet(input: CreateBetInput): Promise<Bet> {
    const user = getStoredUser();

    if (!user) {
      throw new Error('Debes iniciar sesión para participar');
    }

    const existingBet = mockPublicBets.find((bet) => bet.participant.id === user.id);

    if (existingBet) {
      throw new Error('Ya tienes una participación registrada');
    }

    const newPublicBet: PublicBet = {
      id: `mock-bet-${Date.now()}`,
      matchName: 'México vs Ecuador',
      goalHalf: input.goalHalf,
      minute: input.minute,
      amount: input.amount,
      participant: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };

    mockPublicBets.unshift(newPublicBet);

    return toMyBet(newPublicBet);
  }
};
