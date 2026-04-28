import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})

export class Auth {
  isAuth = signal(sessionStorage.getItem('authenticated') === 'true');

  loginWithGoogle(): void {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  isAuthenticated(): boolean {
    // No podemos leer la cookie httpOnly desde JS
    // La validación real la hace el backend
    // Aquí usamos una flag en sessionStorage para saber si el usuario pasó por el callback
    return sessionStorage.getItem('authenticated') === 'true';
  }

  setAuthenticated(): void {
    sessionStorage.setItem('authenticated', 'true');
    this.isAuth.set(true);
  }

  logout(): void {
    fetch(`${environment.apiUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // necesario para mandar la cookie
    }).finally(() => {
      sessionStorage.clear();
      localStorage.clear();
      this.isAuth.set(false);
      window.location.href = '/login';
    });
  }
}