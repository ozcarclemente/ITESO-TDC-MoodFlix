// import { Component, OnInit, signal } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { Movie } from '../../core/services/movie';

// @Component({
//   selector: 'app-landing',
//   standalone: true,
//   imports: [RouterLink],
//   templateUrl: './landing.html',
//   styleUrl: './landing.scss'
// })
// export class Landing implements OnInit {
//   movies = signal<any[]>([]);

//   constructor(private movieService: Movie) {}

//   ngOnInit() {
//     this.movieService.getPopularMovies().subscribe({
//       next: (data: any) => {
//         this.movies.set(data.results);
//       },
//       error: (err) => {
//         console.error('Error al obtener películas', err);
//       }
//     });
//   }
// }

import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/questionnaire']);
    }
  }
}