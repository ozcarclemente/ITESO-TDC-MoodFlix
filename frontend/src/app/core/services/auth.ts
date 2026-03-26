import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class Auth {
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
  }
  
  logout(): void {
    fetch(`${environment.apiUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // necesario para mandar la cookie
    }).finally(() => {
      sessionStorage.removeItem('authenticated');
      window.location.href = '/auth/login';
    });
  }
}