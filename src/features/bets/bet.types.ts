import type { GoalHalf } from '../match/match.types';

export type BetAmount = 50 | 100;

export interface Bet {
  id: string;
  userId: string;
  matchName: string;
  goalHalf: GoalHalf;
  minute: number;
  amount: BetAmount;
}

export interface PublicBet {
  id: string;
  matchName: string;
  goalHalf: GoalHalf;
  minute: number;
  amount: BetAmount;
  participant: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateBetInput {
  goalHalf: GoalHalf;
  minute: number;
  amount: BetAmount;
}

export interface CreateBetResponse {
  message: string;
  bet: Bet;
}

export interface MyBetResponse {
  bet: Bet;
}

export interface PublicBetsResponse {
  bets: PublicBet[];
}

export interface BetService {
  listPublicBets: () => Promise<PublicBet[]>;
  getMyBet: () => Promise<Bet | null>;
  createBet: (input: CreateBetInput) => Promise<Bet>;
}
