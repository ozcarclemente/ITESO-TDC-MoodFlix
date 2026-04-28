import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user`;
  private userPhotoSubject = new BehaviorSubject<string | null>(null);
  userPhoto$ = this.userPhotoSubject.asObservable();

  // CREATE: Enviar el ID de la película para guardarla en la lista de favoritos
  addFavorite(movieId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorites`, { movieId }, {
      withCredentials: true 
    });
  }

  // READ: Obtener el arreglo de películas favoritas
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favorites`, {
      withCredentials: true
    });
  }

  // DELETE: Eliminar una película de favoritos por su ID
  removeFavorite(movieId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/${movieId}`, {
      withCredentials: true
    });
  }

  getMe(): Observable<{ id: string; name: string; email: string }> {
    return this.http.get<{ id: string; name: string; email: string }>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    );
  }

  getProfile(): Observable<{ name: string; email: string; photoUrl?: string; birthDate?: string }> {
    return this.http.get<{ name: string; email: string; photoUrl?: string; birthDate?: string }>(
      `${this.apiUrl}/profile`,
      { withCredentials: true }
    );
  }

  updateProfile(data: { name?: string; photoUrl?: string; birthDate?: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profile`, data, { withCredentials: true });
  }

  setUserPhoto(photoUrl: string | null): void {
    this.userPhotoSubject.next(photoUrl);
  }
}