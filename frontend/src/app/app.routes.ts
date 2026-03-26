import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing').then(m => m.Landing),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth/callback/callback').then(m => m.Callback),
  },
  {
    path: 'questionnaire',
    loadComponent: () =>
      import('./features/questionnaire/questionnaire').then(m => m.Questionnaire),
    canActivate: [authGuard],
  },
  {
    path: 'recommendations',
    loadComponent: () =>
      import('./features/recommendations/recommendations').then(m => m.Recommendations),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];