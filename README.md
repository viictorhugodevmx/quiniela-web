# Quiniela México Web

Frontend de Quiniela México, una app web para registrar predicciones sobre el minuto del primer gol de México.

La aplicación permite iniciar sesión, registrar una participación, consultar la predicción propia y visualizar un tablero público de participantes.

## Producto

**Reto del Primer Gol**

Predice el minuto exacto del primer gol de México, registra tu participación y compite en el tablero público.

## Stack

- React
- Vite
- TypeScript
- CSS
- LocalStorage
- Fetch API

## Requisitos

- Node.js 20.19.4
- npm
- Backend local opcional en `http://localhost:3000`

## Instalación

```bash
npm install
Variables de entorno

Crear archivo .env:

VITE_API_MODE=mock
VITE_API_URL=http://localhost:3000
Modos disponibles
Modo mock
VITE_API_MODE=mock

Permite usar la app sin backend.

Incluye datos simulados para:

Configuración del partido
Login demo
Tablero público
Registro de participación

Usuario demo:

victor@app0.com / 123456
Modo backend
VITE_API_MODE=backend
VITE_API_URL=http://localhost:3000

Consume la API real:

http://localhost:3000

Endpoints usados:

GET /api/match
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
GET /api/bets
GET /api/bets/me
POST /api/bets
Scripts
npm run dev
npm run build
npm run preview
Ejecutar en desarrollo
npm run dev

URL esperada:

http://localhost:5173
Build de producción
npm run build
Preview de producción
npm run preview
Flujo principal
Cargar configuración del partido.
Mostrar partido destacado.
Permitir login o registro.
Mostrar participante activo.
Permitir registrar predicción si el usuario no tiene una.
Mostrar predicción propia.
Mostrar tablero público.
Arquitectura frontend
src/
  App.tsx
  main.tsx
  config/
    env.ts
  features/
    auth/
      auth.types.ts
      services/
        auth.backend.service.ts
        auth.mock.service.ts
        auth.service.ts
        auth.storage.ts
    bets/
      bet.types.ts
      services/
        bet.backend.service.ts
        bet.mock.service.ts
        bet.service.ts
    match/
      match.types.ts
      services/
        match.backend.service.ts
        match.mock.service.ts
        match.service.ts
  styles/
    global.css
Patrón mock/backend

Los componentes no consumen directamente fetch.

La app usa servicios por feature:

authService
betService
matchService

Cada service decide si usa mock o backend según:

VITE_API_MODE

Esto permite mostrar la app como demo sin backend y también probarla con API real local.

Checklist visual

La app debe mostrar:

Eyebrow: Reto del Primer Gol
Badge: Quiniela activa
Título: Quiniela México
Partido destacado
Entrada de $50 / $100
Login / Registro
Participante activo
Mi predicción
Tablero público
Franja técnica discreta al final
Conceptos aplicados
React con TypeScript
Estado local con useState
Carga inicial con useEffect
Formularios controlados por FormData
Servicios por feature
Separación mock/backend
Manejo de sesión con LocalStorage
Consumo de API con Fetch
UI responsive
Build con Vite
EO