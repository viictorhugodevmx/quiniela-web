import type { MatchConfig, MatchService } from '../match.types';

const mockMatchConfig: MatchConfig = {
  matchName: 'México vs Ecuador',
  targetTeam: 'México',
  rivalTeam: 'Ecuador',
  allowedAmounts: [50, 100],
  periods: [
    {
      label: 'Primer tiempo',
      value: 'FIRST_HALF',
      minMinute: 1,
      maxMinute: 45
    },
    {
      label: 'Segundo tiempo',
      value: 'SECOND_HALF',
      minMinute: 46,
      maxMinute: 90
    }
  ],
  rules: [
    'Debes adivinar el minuto del primer gol de México.',
    'Solo puedes registrar una participación por usuario.',
    'Los montos permitidos son 50 o 100 pesos.',
    'El minuto debe coincidir con el periodo seleccionado.'
  ]
};

export const matchMockService: MatchService = {
  async getMatchConfig() {
    return mockMatchConfig;
  }
};
