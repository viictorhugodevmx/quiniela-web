import { useEffect, useState } from 'react';

import { frontendEnv } from './config/env';
import { matchService } from './features/match/services/match.service';
import type { MatchConfig } from './features/match/match.types';

function App() {
  const [match, setMatch] = useState<MatchConfig | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    async function loadMatchConfig() {
      try {
        const matchConfig = await matchService.getMatchConfig();

        setMatch(matchConfig);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    }

    loadMatchConfig();
  }, []);

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Reto del Primer Gol</p>

        <h1>Quiniela México</h1>

        <p className="hero-text">
          Adivina en qué minuto cae el primer gol de México y registra tu participación.
        </p>

        <div className="status-grid">
          <article>
            <span>Modo API</span>
            <strong>{frontendEnv.apiMode}</strong>
          </article>

          <article>
            <span>Backend URL</span>
            <strong>{frontendEnv.apiUrl}</strong>
          </article>
        </div>

        {status === 'loading' && (
          <p className="note">Cargando configuración del partido...</p>
        )}

        {status === 'error' && (
          <p className="error-text">
            No se pudo cargar la configuración del partido. Revisa el backend o usa modo mock.
          </p>
        )}

        {status === 'success' && match && (
          <section className="match-panel">
            <div>
              <span className="section-label">Partido</span>
              <h2>{match.matchName}</h2>
              <p>
                Equipo objetivo: <strong>{match.targetTeam}</strong>
              </p>
            </div>

            <div className="pill-row">
              {match.allowedAmounts.map((amount) => (
                <span className="pill" key={amount}>
                  ${amount}
                </span>
              ))}
            </div>

            <div className="period-grid">
              {match.periods.map((period) => (
                <article key={period.value}>
                  <strong>{period.label}</strong>
                  <span>
                    Minutos {period.minMinute} - {period.maxMinute}
                  </span>
                </article>
              ))}
            </div>

            <ul className="rules-list">
              {match.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
