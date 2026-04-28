import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { QuestionnaireStateService } from '../../core/services/questionnaire-state.service';
import { Movie } from '../../core/services/movie';
import { UserService } from '../../core/services/user.service'; 
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [RouterLink, DecimalPipe], 
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss',
})
export class Recommendations implements OnInit {
  private stateService = inject(QuestionnaireStateService);
  private movieService = inject(Movie);
  private router = inject(Router);
  private userService = inject(UserService); 
  

  movies = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  savingIds = signal<string[]>([]);
  savedMovieIds = signal<string[]>([]);

  ngOnInit(): void {
    const answers = this.stateService.answers();
    if (!answers) {
      console.warn('No hay respuestas guardadas. Redirigiendo al cuestionario...');
      this.router.navigate(['/questionnaire']);
      return;
    }
    this.fetchRecommendations(answers);
    this.loadUserSavedMovies();
  }


  private loadUserSavedMovies(): void {
    this.userService.getFavorites().subscribe({
      next: (movies) => {
        // Extraemos solo los IDs para hacer validaciones ultrarrápidas en el HTML
        const ids = movies.map((m: any) => m._id);
        this.savedMovieIds.set(ids);
      },
      error: (err) => console.error('Error cargando historial del usuario', err)
    });
  }


  private fetchRecommendations(answers: any): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.movieService.getRecommendations(answers).subscribe({
      next: (response) => {
        this.movies.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error de la API:', err);
        this.errorMessage.set('Tuvimos un problema al conectar con el servidor. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  toggleFavorite(movie: any): void {
    const movieId = movie._id;
    const isSaved = this.savedMovieIds().includes(movieId);

    // Bloqueamos el botón en la UI para evitar clics dobles
    this.savingIds.update(ids => [...ids, movieId]);

    if (isSaved) {
      // Si ya está guardada, ejecutamos la eliminación
      this.userService.removeFavorite(movieId).subscribe({
        next: () => {
          // Quitamos el ID de ambas listas para desbloquear y actualizar el estado visual
          this.savedMovieIds.update(ids => ids.filter(id => id !== movieId));
          this.savingIds.update(ids => ids.filter(id => id !== movieId));
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.savingIds.update(ids => ids.filter(id => id !== movieId));
        }
      });
    } else {
      // Si no está guardada, ejecutamos la creación (código que ya tenías)
      this.userService.addFavorite(movieId).subscribe({
        next: () => {
          this.savedMovieIds.update(ids => [...ids, movieId]);
          this.savingIds.update(ids => ids.filter(id => id !== movieId));
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          this.savingIds.update(ids => ids.filter(id => id !== movieId));
        }
      });
    }
  }
}