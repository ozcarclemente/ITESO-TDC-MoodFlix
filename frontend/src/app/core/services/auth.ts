import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class Auth {
  isAuth = signal(sessionStorage.getItem('authenticated') === 'true');

  constructor(private http: HttpClient) {}

  loginWithGoogle(): void {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  register(email: string, password: string, passwordConfirm: string, name: string): Promise<any> {
    return fetch(`${environment.apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, passwordConfirm, name }),
    }).then(res => {
      if (!res.ok) return res.json().then(err => Promise.reject(err));
      return res.json();
    });
  }

  login(email: string, password: string): Promise<any> {
    return fetch(`${environment.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    }).then(res => {
      if (!res.ok) return res.json().then(err => Promise.reject(err));
      return res.json();
    });
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
      credentials: 'include',
    }).finally(() => {
      sessionStorage.clear();
      localStorage.clear();
      this.isAuth.set(false);
      window.location.href = '/login';
    });
  }
}