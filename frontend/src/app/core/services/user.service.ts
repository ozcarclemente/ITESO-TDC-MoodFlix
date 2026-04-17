import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/user';

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
}