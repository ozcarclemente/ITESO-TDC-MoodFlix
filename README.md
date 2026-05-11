# MoodFlix

Plataforma web responsiva que genera recomendaciones personalizadas de películas basadas en el estado emocional inmediato del usuario.

## Descripción

MoodFlix resuelve el problema de la sobrecarga de opciones en servicios de streaming. En lugar de basar las recomendaciones en historial de consumo, el sistema aplica un cuestionario emocional para identificar el estado de ánimo, nivel de energía, tolerancia a la tensión y tiempo disponible del usuario en el momento de la búsqueda. A partir de esos datos genera entre 5 y 15 recomendaciones curadas con una explicación transparente de por qué cada película fue seleccionada.

## Estructura del Proyecto

```
moodflix/
├── frontend/                        # Aplicación Angular (SPA)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   │   └── auth-guard.ts
│   │   │   │   ├── models/
│   │   │   │   │   └── questionnaire.ts
│   │   │   │   └── services/
│   │   │   │       ├── auth.ts
│   │   │   │       ├── movie.ts
│   │   │   │       ├── user.service.ts
│   │   │   │       ├── chat.service.ts
│   │   │   │       └── questionnaire-state.service.ts
│   │   │   ├── screens/
│   │   │   │   ├── landing/
│   │   │   │   ├── auth/
│   │   │   │   │   └── login/
│   │   │   │   ├── home/
│   │   │   │   ├── questionnaire/
│   │   │   │   ├── recommendations/
│   │   │   │   ├── profile/
│   │   │   │   │   └── change-password-dialog/
│   │   │   │   ├── library/
│   │   │   │   └── movie-detail/
│   │   │   ├── shared/
│   │   │   │   └── components/
│   │   │   │       ├── navbar/
│   │   │   │       └── footer/
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── app.ts
│   │   │   └── app.scss
│   │   ├── environments/
│   │   │   ├── environment.ts
│   │   │   └── environment.development.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── public/
│   ├── nginx.conf
│   ├── Dockerfile
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
└── backend/                         # API REST con Node.js + Express
    └── src/
        ├── config/
        │   ├── index.ts
        │   └── passport.ts          # Configuración OAuth 2.0 con Google
        ├── controllers/
        │   ├── auth.controller.ts
        │   ├── message.controller.ts
        │   ├── movies.controller.ts
        │   ├── playlist.controller.ts
        │   ├── user.controller.ts
        │   └── index.ts
        ├── middlewares/
        │   ├── auth.middleware.ts   # Validación JWT
        │   └── index.ts
        ├── models/
        │   ├── user.model.ts
        │   ├── movie.model.ts
        │   ├── message.model.ts
        │   ├── playlist.model.ts
        │   ├── questionnaire.model.ts
        │   ├── user-watched.model.ts
        │   └── index.ts
        ├── routes/
        │   ├── auth.routes.ts
        │   ├── message.routes.ts
        │   ├── movies.routes.ts
        │   ├── user.routes.ts
        │   └── index.ts
        ├── services/
        │   ├── auth.service.ts
        │   ├── recommendationEngine.ts
        │   ├── derive-scores.service.ts
        │   └── index.ts
        ├── scripts/
        │   └── seed.ts              # Scripts DB
        ├── sockets/
        │   └── index.ts
        └── index.ts
```

## Stack Tecnológico

**Frontend**
- Angular + TypeScript
- Diseño responsivo mobile

**Backend**
- Node.js + Express.js + TypeScript
- Auth: Google OAuth 2.0 (Passport.js) o registro manual (email/password). JWT para sesiones.
**Base de Datos**
- MongoDB Atlas

**Servicios externos**
- TMDB API (metadatos de películas)
- AWS S3 (imágenes de perfil de usuario)

**Infraestructura (IaaS)**
- **Compute**: Google Cloud Compute Engine (VMs con Docker)
- **Registry**: Google Cloud Artifact Registry
- **Orquestación**: Docker + Docker Compose
- **Base de datos**: MongoDB Atlas (cloud)
- **CI/CD**: GitHub Actions (build + deploy automático)

## Setup Local

### Prerequisites
- Node.js 18+
- MongoDB Atlas (credenciales)
- Google OAuth credentials

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

Accede a `http://localhost:4200`

## Autores

- Emilio Maciel
- Oscar Clemente López