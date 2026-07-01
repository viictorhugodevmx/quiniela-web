import { frontendEnv } from './config/env';

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">APP 0 · Backend Node Expert Lab</p>

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

        <p className="note">
          Front inicial listo. En los siguientes pasos conectaremos match config, auth y apuestas.
        </p>
      </section>
    </main>
  );
}

export default App;
