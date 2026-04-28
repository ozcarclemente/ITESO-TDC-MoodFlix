import { Component, inject, signal, HostListener, ElementRef, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);
  private el = inject(ElementRef);
  private userService = inject(UserService);

  avatarDropdownOpen = signal(false);
  menuOpen = signal(false);
  userPhoto = signal<string | null>(null);

  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.userService.userPhoto$.subscribe({
        next: (photoUrl) => {
          this.userPhoto.set(photoUrl);
        },
      });

      this.userService.getProfile().subscribe({
        next: (user) => {
          this.userService.setUserPhoto(user.photoUrl ?? null);
        },
        error: () => {
          this.userService.setUserPhoto(null);
        },
      });
    }
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }

  // Cierra el menú si se hace click fuera o se redimensiona a desktop
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if ((event.target as Window).innerWidth >= 768) {
      this.closeMenu();
    }
  }

  // Lógica para el dropdown del avatar

  toggleAvatarDropdown(): void {
    this.avatarDropdownOpen.update(v => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.avatarDropdownOpen.set(false);
    }
  }
}