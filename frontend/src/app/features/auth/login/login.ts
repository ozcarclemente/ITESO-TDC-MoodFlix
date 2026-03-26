import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  constructor(private authService: Auth) { }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}