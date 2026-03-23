import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Movie {
  private baseUrl = 'https://api.themoviedb.org/3';
  private headers = new HttpHeaders({
    Authorization: `Bearer ${environment.tmdbToken}`
  });

  constructor(private http: HttpClient) {}

  getPopularMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/popular`, { headers: this.headers });
  }
}