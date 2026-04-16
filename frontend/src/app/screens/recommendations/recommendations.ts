import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// Importamos nuestros servicios
import { QuestionnaireStateService } from '../../core/services/questionnaire-state.service';
import { Movie } from '../../core/services/movie';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss',
})
export class Recommendations implements OnInit {
  private stateService = inject(QuestionnaireStateService);
  private movieService = inject(Movie);
  private router = inject(Router);

  // Estados de la interfaz usando Signals (Requerimiento Sprint 2)
  movies = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // 1. Leemos las respuestas que guardamos en la bóveda (sessionStorage)
    const answers = this.stateService.answers();

    if (!answers) {
      // Protección: Si alguien entra a /recommendations sin contestar, lo regresamos.
      console.warn('No hay respuestas guardadas. Redirigiendo al cuestionario...');
      this.router.navigate(['/questionnaire']);
      return;
    }

    // 2. Si tenemos las respuestas, le pedimos las películas al backend
    this.fetchRecommendations(answers);
  }

  private fetchRecommendations(answers: any): void {
    // Aseguramos que la UI muestre que está cargando
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Consumimos el endpoint POST que acabas de arreglar en el backend
    this.movieService.getRecommendations(answers).subscribe({
      next: (response) => {
        // ÉXITO: Guardamos las películas y quitamos la pantalla de carga
        console.log('Películas recibidas del backend:', response);
        this.movies.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        // ERROR: El servidor falló. Mostramos un mensaje amigable.
        console.error('Error de la API:', err);
        this.errorMessage.set('Tuvimos un problema al conectar con el servidor. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }
}