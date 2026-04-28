import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Movie } from '../../core/services/movie';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private movieService = inject(Movie);

  movies = signal<any[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  selectedGenre = signal('');
  selectedMood = signal('');
  sortBy = signal<'title' | 'rating' | 'releaseDate'>('title');

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.isLoading.set(true);
    const params: any = { page: this.currentPage(), limit: 20, sort: this.sortBy() };
    if (this.selectedGenre()) params.genre = this.selectedGenre();
    if (this.selectedMood()) params.mood = this.selectedMood();

    this.movieService.getAllMovies(params).subscribe({
      next: (response) => {
        this.movies.set(response.movies);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);
        this.error.set(null);
      },
      error: (err) => {
        console.error('Error cargando películas:', err);
        this.error.set('No pudimos cargar las películas. Intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.fetchMovies();
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.fetchMovies();
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.fetchMovies();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.fetchMovies();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (current >= total - 2) {
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        for (let i = current - 2; i <= current + 2; i++) pages.push(i);
      }
    }
    return pages;
  }

  resetFilters(): void {
    this.selectedGenre.set('');
    this.selectedMood.set('');
    this.onFilterChange();
  }
}