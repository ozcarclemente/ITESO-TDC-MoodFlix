import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private userService = inject(UserService);

  savedMovies = signal<any[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchSavedMovies();
  }

  fetchSavedMovies(): void {
    this.isLoading.set(true);
    this.userService.getFavorites().subscribe({
      next: (movies) => {
        this.savedMovies.set(movies);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando la lista:', err);
        this.error.set('No pudimos cargar tu lista de pendientes.');
        this.isLoading.set(false);
      }
    });
  }

  removeFromList(movieId: string): void {
    //  quitamos la película de la vista inmediatamente
    // para que la interfaz se sienta ultrarrápida, y luego hacemos la petición.
    const currentMovies = this.savedMovies();
    this.savedMovies.update(movies => movies.filter(m => m._id !== movieId));

    this.userService.removeFavorite(movieId).subscribe({
      error: (err) => {
        console.error('Error al eliminar:', err);
        // Si falla el servidor, regresamos la película a la pantalla
        this.savedMovies.set(currentMovies);
        alert('Ocurrió un error al quitar la película de tu lista.');
      }
    });
  }
}