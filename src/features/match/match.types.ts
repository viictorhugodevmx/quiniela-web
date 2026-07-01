export type GoalHalf = 'FIRST_HALF' | 'SECOND_HALF';

export interface MatchPeriod {
  label: string;
  value: GoalHalf;
  minMinute: number;
  maxMinute: number;
}

export interface MatchConfig {
  matchName: string;
  targetTeam: string;
  rivalTeam: string;
  allowedAmounts: number[];
  periods: MatchPeriod[];
  rules: string[];
}

export interface MatchConfigResponse {
  match: MatchConfig;
}

export interface MatchService {
  getMatchConfig: () => Promise<MatchConfig>;
}
