import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../core/services/movie';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit {
  movies = signal<any[]>([]);

  constructor(private movieService: Movie) {}

  ngOnInit() {
    this.movieService.getPopularMovies().subscribe({
      next: (data: any) => {
        this.movies.set(data.results);
      },
      error: (err) => {
        console.error('Error al obtener películas', err);
      }
    });
  }
}