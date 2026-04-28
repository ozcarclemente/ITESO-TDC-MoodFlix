import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionnaireAnswers } from '../models/questionnaire';

@Injectable({
  providedIn: 'root'
})
export class Movie {
  private http = inject(HttpClient);
  
  // Apuntamos al backend, no a TheMovieDB
  private apiUrl = 'http://localhost:3000/api/movies';

  getMovie(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getRecommendations(answers: QuestionnaireAnswers): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommendations`, answers, {
      withCredentials: true
    });
  }

  getAllMovies(params?: { genre?: string; mood?: string; page?: number; limit?: number }): Observable<any> {
    return this.http.get<{ movies: any[]; total: number; page: number; totalPages: number }>(
      this.apiUrl,
      { params: { ...params }, withCredentials: true }
    );
  }
}