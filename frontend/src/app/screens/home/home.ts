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

  searchQuery = signal('');
  selectedGenre = signal('');
  selectedMood = signal('');
  sortBy = signal<'title' | 'rating' | 'releaseDate'>('title');

  private searchTimeout: any;

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.isLoading.set(true);
    const params: any = {
      page: this.currentPage(),
      limit: 20,
      sort: this.sortBy()
    };

    if (this.searchQuery()) params.search = this.searchQuery();
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

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(1);
      this.fetchMovies();
    }, 300);
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
    this.searchQuery.set('');
    this.selectedGenre.set('');
    this.selectedMood.set('');
    this.onFilterChange();
  }

  /* Local search approach (commented - can revert if needed):
  allMovies = signal<any[]>([]);

  loadAllMovies(): void {
    this.isLoading.set(true);
    const params: any = { limit: 10000, sort: this.sortBy() };

    this.movieService.getAllMovies(params).subscribe({
      next: (response) => {
        this.allMovies.set(response.movies);
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

  getFilteredMovies(): any[] {
    let filtered = this.allMovies();

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(m => m.title.toLowerCase().includes(query));
    }

    if (this.selectedGenre()) {
      filtered = filtered.filter(m => m.genres.includes(this.selectedGenre()));
    }

    if (this.selectedMood()) {
      filtered = filtered.filter(m => m.scores.moods.includes(this.selectedMood()));
    }

    return filtered;
  }

  get moviesLocal(): any[] {
    const filtered = this.getFilteredMovies();
    const start = (this.currentPage() - 1) * 20;
    return filtered.slice(start, start + 20);
  }

  get totalPagesLocal(): number {
    return Math.ceil(this.getFilteredMovies().length / 20);
  }
  */
}
