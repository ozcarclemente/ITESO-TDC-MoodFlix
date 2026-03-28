import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./screens/landing/landing').then(m => m.Landing),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./screens/home/home').then(m => m.Home),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./screens/auth/login/login').then(m => m.Login),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./screens/auth/callback/callback').then(m => m.Callback),
  },
  {
    path: 'questionnaire',
    loadComponent: () =>
      import('./screens/questionnaire/questionnaire').then(m => m.Questionnaire),
    canActivate: [authGuard],
  },
  {
    path: 'recommendations',
    loadComponent: () =>
      import('./screens/recommendations/recommendations').then(m => m.Recommendations),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];