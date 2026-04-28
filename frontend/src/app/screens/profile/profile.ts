import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  isLoading = signal(true);
  isSaving = signal(false);
  saveSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  email = signal('');

  profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    photoUrl: [''],
    birthDate: [''],
  });

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.email.set(user.email);
        this.profileForm.patchValue({
          name: user.name,
          photoUrl: user.photoUrl ?? '',
          birthDate: user.birthDate ? user.birthDate.substring(0, 10) : '',
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el perfil.');
        this.isLoading.set(false);
      },
    });
  }

  get nameControl() { return this.profileForm.get('name'); }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.saveSuccess.set(false);
    this.errorMessage.set(null);

    const { name, photoUrl, birthDate } = this.profileForm.value;

    this.userService.updateProfile({ name, photoUrl, birthDate: birthDate || undefined }).subscribe({
      next: () => {
        this.userService.setUserPhoto(photoUrl || null);
        this.isSaving.set(false);
        this.saveSuccess.set(true);
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set('No se pudieron guardar los cambios. Intenta de nuevo.');
      },
    });
  }
}
