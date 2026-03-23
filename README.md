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
│   │   │   │       └── movie.ts
│   │   │   ├── screens/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── callback/
│   │   │   │   │   └── login/
│   │   │   │   ├── home/
│   │   │   │   ├── landing/
│   │   │   │   ├── questionnaire/
│   │   │   │   └── recommendations/
│   │   │   ├── shared/
│   │   │   │   └── components/
│   │   │   │       ├── footer/
│   │   │   │       └── navbar/
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   ├── environments/
│   │   │   └── environment.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
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
        │   └── index.ts
        ├── middlewares/
        │   ├── auth.middleware.ts   # Validación JWT
        │   └── index.ts
        ├── models/
        │   ├── user.model.ts
        │   └── index.ts
        ├── routes/
        │   ├── auth.routes.ts
        │   └── index.ts
        ├── services/
        │   ├── auth.service.ts
        │   └── index.ts
        ├── sockets/
        │   └── index.ts
        └── index.ts
```

## Stack Tecnológico

**Frontend**
- Angular + TypeScript
- Diseño responsivo mobile-first

**Backend**
- Node.js + Express.js + TypeScript
- Autenticación: OAuth 2.0 con Google (Passport.js) + JWT

**Base de Datos**
- MongoDB Atlas

**Servicios externos**
- TMDB API (metadatos de películas)

**Infraestructura**
- Frontend: Vercel
- Backend: Render / Railway
- Base de datos: MongoDB Atlas

## Autores

- Emilio Maciel
- Oscar Clemente López