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
    path: 'library',
    loadComponent: () =>
      import('./screens/library/library').then(m => m.Library),
    canActivate: [authGuard],
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./screens/auth/login/login').then(m => m.Login),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./screens/profile/profile').then(m => m.Profile),
    canActivate: [authGuard],
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
    path: 'movie/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./screens/movie-detail/movie-detail').then(m => m.MovieDetail),
    children: [
      {
        path: 'chat',
        loadComponent: () =>
          import('./screens/movie-detail/chat/chat').then(m => m.Chat),
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];