import { useEffect, useState } from 'react';

import { frontendEnv } from './config/env';
import type { AuthUser } from './features/auth/auth.types';
import { authService } from './features/auth/services/auth.service';
import type { MatchConfig } from './features/match/match.types';
import { matchService } from './features/match/services/match.service';

type AuthMode = 'login' | 'register';

function App() {
  const [match, setMatch] = useState<MatchConfig | null>(null);
  const [matchStatus, setMatchStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [matchConfig, currentUser] = await Promise.all([
          matchService.getMatchConfig(),
          authService.me()
        ]);

        setMatch(matchConfig);
        setUser(currentUser);
        setMatchStatus('success');
      } catch {
        setMatchStatus('error');
      }
    }

    loadInitialData();
  }, []);

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    setAuthMessage('');

    const formData = new FormData(form);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const name = String(formData.get('name') || '');

    try {
      if (authMode === 'register') {
        await authService.register({
          name,
          email,
          password
        });

        setAuthMessage('Registro exitoso. Ahora inicia sesión.');
        setAuthMode('login');
        form.reset();
        return;
      }

      const result = await authService.login({
        email,
        password
      });

      setUser(result.user);
      setAuthMessage('Sesión iniciada correctamente.');
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo completar la acción';
      setAuthMessage(message);
    }
  }

  function handleLogout() {
    authService.logout();
    setUser(null);
    setAuthMessage('Sesión cerrada.');
  }

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

        {matchStatus === 'loading' && (
          <p className="note">Cargando configuración del partido...</p>
        )}

        {matchStatus === 'error' && (
          <p className="error-text">
            No se pudo cargar la configuración del partido. Revisa el backend o usa modo mock.
          </p>
        )}

        {matchStatus === 'success' && match && (
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
          </section>
        )}

        <section className="auth-panel">
          {user ? (
            <div className="session-card">
              <span className="section-label">Participante</span>
              <h3>{user.name}</h3>
              <p>{user.email}</p>

              <button className="secondary-button" type="button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              <div className="auth-tabs">
                <button
                  className={authMode === 'login' ? 'tab-button active' : 'tab-button'}
                  type="button"
                  onClick={() => setAuthMode('login')}
                >
                  Login
                </button>

                <button
                  className={authMode === 'register' ? 'tab-button active' : 'tab-button'}
                  type="button"
                  onClick={() => setAuthMode('register')}
                >
                  Registro
                </button>
              </div>

              {authMode === 'register' && (
                <label>
                  Nombre
                  <input name="name" placeholder="Tu nombre" type="text" />
                </label>
              )}

              <label>
                Email
                <input name="email" placeholder="victor@app0.com" type="email" />
              </label>

              <label>
                Password
                <input name="password" placeholder="123456" type="password" />
              </label>

              <button className="primary-button" type="submit">
                {authMode === 'login' ? 'Entrar a la quiniela' : 'Crear cuenta'}
              </button>
            </form>
          )}

          {authMessage && <p className="note">{authMessage}</p>}
        </section>
      </section>
    </main>
  );
}

export default App;
