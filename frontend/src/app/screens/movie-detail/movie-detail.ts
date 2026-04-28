import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Movie } from '../../core/services/movie';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss',
})
export class MovieDetail implements OnInit {
  private movieService = inject(Movie);
  private route = inject(ActivatedRoute);

  movie = signal<any>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const movieId = this.route.snapshot.params['id'];
    if (!movieId) {
      this.error.set('ID de película no válido');
      this.loading.set(false);
      return;
    }

    this.movieService.getMovie(movieId).subscribe({
      next: (data) => {
        this.movie.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando película:', err);
        this.error.set('Error cargando los detalles de la película');
        this.loading.set(false);
      },
    });
  }
}
