import { useEffect, useState } from 'react';

import { frontendEnv } from './config/env';
import type { AuthUser } from './features/auth/auth.types';
import { authService } from './features/auth/services/auth.service';
import type { Bet, BetAmount, PublicBet } from './features/bets/bet.types';
import { betService } from './features/bets/services/bet.service';
import type { GoalHalf, MatchConfig } from './features/match/match.types';
import { matchService } from './features/match/services/match.service';

type AuthMode = 'login' | 'register';

function formatGoalHalf(goalHalf: GoalHalf): string {
  return goalHalf === 'FIRST_HALF' ? 'Primer tiempo' : 'Segundo tiempo';
}

function App() {
  const [match, setMatch] = useState<MatchConfig | null>(null);
  const [matchStatus, setMatchStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [myBet, setMyBet] = useState<Bet | null>(null);
  const [publicBets, setPublicBets] = useState<PublicBet[]>([]);
  const [authMessage, setAuthMessage] = useState('');
  const [betMessage, setBetMessage] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [matchConfig, currentUser, bets] = await Promise.all([
          matchService.getMatchConfig(),
          authService.me(),
          betService.listPublicBets()
        ]);

        setMatch(matchConfig);
        setUser(currentUser);
        setPublicBets(bets);

        if (currentUser) {
          const currentBet = await betService.getMyBet();
          setMyBet(currentBet);
        }

        setMatchStatus('success');
      } catch {
        setMatchStatus('error');
      }
    }

    loadInitialData();
  }, []);

  async function refreshBets(): Promise<void> {
    const [bets, currentBet] = await Promise.all([
      betService.listPublicBets(),
      betService.getMyBet()
    ]);

    setPublicBets(bets);
    setMyBet(currentBet);
  }

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    setAuthMessage('');
    setBetMessage('');

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

      const currentBet = await betService.getMyBet();
      setMyBet(currentBet);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo completar la acción';
      setAuthMessage(message);
    }
  }

  function handleLogout() {
    authService.logout();
    setUser(null);
    setMyBet(null);
    setAuthMessage('Sesión cerrada.');
    setBetMessage('');
  }

  async function handleBetSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    setBetMessage('');

    const formData = new FormData(form);
    const goalHalf = String(formData.get('goalHalf')) as GoalHalf;
    const minute = Number(formData.get('minute'));
    const amount = Number(formData.get('amount')) as BetAmount;

    try {
      const bet = await betService.createBet({
        goalHalf,
        minute,
        amount
      });

      setMyBet(bet);
      setBetMessage('Participación registrada correctamente.');
      form.reset();

      await refreshBets();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo registrar la participación';
      setBetMessage(message);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-top">
          <p className="eyebrow">Reto del Primer Gol</p>
          <span className="live-badge">Quiniela activa</span>
        </div>

        <h1>Quiniela México</h1>

        <p className="hero-text">
          Predice el minuto exacto del primer gol de México, registra tu participación
          y compite en el tablero público.
        </p>

        {matchStatus === 'loading' && (
          <p className="note">Cargando configuración del partido...</p>
        )}

        {matchStatus === 'error' && (
          <p className="error-text">
            No se pudo cargar la configuración del partido. Revisa el backend o usa modo mock.
          </p>
        )}

        {matchStatus === 'success' && match && (
          <>
            <section className="match-panel">
              <div className="match-heading">
                <div>
                  <span className="section-label">Partido destacado</span>
                  <h2>{match.matchName}</h2>
                  <p>
                    El reto es adivinar el primer gol de <strong>{match.targetTeam}</strong>.
                  </p>
                </div>

                <div className="amount-box">
                  <span>Entrada</span>
                  <strong>
                    {match.allowedAmounts.map((amount) => `$${amount}`).join(' / ')}
                  </strong>
                </div>
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

            <section className="auth-panel">
              {user ? (
                <div className="session-card">
                  <span className="section-label">Participante activo</span>
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

            <section className="bet-panel">
              <span className="section-label">Mi predicción</span>

              {!user && (
                <p className="muted-text">
                  Inicia sesión para registrar tu minuto del primer gol.
                </p>
              )}

              {user && myBet && (
                <div className="my-bet-card">
                  <strong>{formatGoalHalf(myBet.goalHalf)}</strong>
                  <span>Minuto {myBet.minute}</span>
                  <span>${myBet.amount}</span>
                </div>
              )}

              {user && !myBet && (
                <form className="bet-form" onSubmit={handleBetSubmit}>
                  <label>
                    Tiempo
                    <select name="goalHalf" defaultValue="FIRST_HALF">
                      {match.periods.map((period) => (
                        <option key={period.value} value={period.value}>
                          {period.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Minuto
                    <input name="minute" placeholder="23" type="number" />
                  </label>

                  <label>
                    Monto
                    <select name="amount" defaultValue="50">
                      {match.allowedAmounts.map((amount) => (
                        <option key={amount} value={amount}>
                          ${amount}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button className="primary-button" type="submit">
                    Registrar participación
                  </button>
                </form>
              )}

              {betMessage && <p className="note">{betMessage}</p>}
            </section>

            <section className="leaderboard-panel">
              <span className="section-label">Tablero público</span>

              <div className="leaderboard-list">
                {publicBets.map((bet) => (
                  <article key={bet.id} className="leaderboard-card">
                    <div>
                      <strong>{bet.participant.name}</strong>
                      <span>{bet.participant.email}</span>
                    </div>

                    <div className="prediction-badge">
                      {formatGoalHalf(bet.goalHalf)} · Min {bet.minute} · ${bet.amount}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="tech-strip">
              <span>Demo técnica</span>
              <strong>{frontendEnv.apiMode}</strong>
              <span>{frontendEnv.apiUrl}</span>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default App;
