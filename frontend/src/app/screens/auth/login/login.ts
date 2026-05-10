import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  isRegistering = signal(false);
  loading = signal(false);
  error = signal('');
  showLoginPassword = signal(false);
  showRegisterPassword = signal(false);
  showRegisterPasswordConfirm = signal(false);

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.initForms();
  }

  initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const passwordConfirm = group.get('passwordConfirm')?.value;
    return password === passwordConfirm ? null : { passwordMismatch: true };
  }

  getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (!control || !control.errors) return '';

    if (control.hasError('required')) return `${fieldName} requerido`;
    if (control.hasError('email')) return 'Email inválido';
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }

  toggleMode(): void {
    this.isRegistering.update(val => !val);
    this.error.set('');
    this.loginForm.reset();
    this.registerForm.reset();
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  login(): void {
    if (!this.loginForm.valid) {
      this.error.set('Email y contraseña requeridos');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
      .then(() => {
        this.authService.setAuthenticated();
        this.router.navigate(['/questionnaire']);
      })
      .catch(err => {
        this.error.set(err.message || 'Error en login');
      })
      .finally(() => this.loading.set(false));
  }

  register(): void {
    if (!this.registerForm.valid) {
      this.error.set('Formulario inválido');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    const { email, password, passwordConfirm, name } = this.registerForm.value;
    this.authService.register(email, password, passwordConfirm, name)
      .then(() => {
        this.authService.setAuthenticated();
        this.router.navigate(['/questionnaire']);
      })
      .catch(err => {
        this.error.set(err.message || 'Error en registro');
      })
      .finally(() => this.loading.set(false));
  }
}