import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  standalone: true,
  selector: 'app-callback',
  template: '',
})
export class Callback implements OnInit {
  constructor(private router: Router, private authService: Auth) {}

  ngOnInit(): void {
    this.authService.setAuthenticated();
    this.router.navigate(['/home']);
  }
}