import { Injectable, signal } from '@angular/core';
import { QuestionnaireAnswers } from '../models/questionnaire';

@Injectable({
  providedIn: 'root'
})

export class QuestionnaireStateService {
  private readonly STORAGE_KEY = 'moodflix_answers';
  
  // Inicializamos el Signal. Su primer valor será lo que encuentre en sessionStorage, o null si está vacío.
  answers = signal<QuestionnaireAnswers | null>(this.loadFromStorage());

  // Método para guardar: Actualiza el Signal y el almacenamiento del navegador simultáneamente
  saveAnswers(newAnswers: QuestionnaireAnswers): void {
    this.answers.set(newAnswers);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(newAnswers));
  }

  // Método para limpiar 
  clearAnswers(): void {
    this.answers.set(null);
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  // Función privada para leer la memoria del navegador al cargar la app
  private loadFromStorage(): QuestionnaireAnswers | null {
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}