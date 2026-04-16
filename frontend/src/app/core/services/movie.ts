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

  // POST para poder enviar el objeto JSON con las respuestas de forma segura
  getRecommendations(answers: QuestionnaireAnswers): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommendations`, answers, {
      withCredentials: true
    });
  }
}