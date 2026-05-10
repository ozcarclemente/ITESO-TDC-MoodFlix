import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../core/services/user.service';
import { ChangePasswordDialog } from './change-password-dialog/change-password-dialog';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  isLoading = signal(true);
  isSaving = signal(false);
  saveSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  email = signal('');
  isGoogleUser = signal(false);

  isUploading = signal(false);

  profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    photoUrl: [''],
    birthDate: [''],
  });

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage.set('La imagen debe pesar menos de 5MB');
        return;
      }
      this.uploadAvatar(file);
    }
  }

  private uploadAvatar(file: File) {
    this.isUploading.set(true);
    this.errorMessage.set(null);

    const formData = new FormData();
    formData.append('avatar', file); 

    this.userService.uploadAvatar(formData).subscribe({
      next: (response) => {
        this.profileForm.patchValue({ photoUrl: response.user.photoUrl });
        this.userService.setUserPhoto(response.user.photoUrl);
        this.isUploading.set(false);
      },
      error: (err) => {
        console.error('Error al subir:', err);
        this.errorMessage.set('Error al subir la imagen a S3.');
        this.isUploading.set(false);
      }
    });
  }

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (user: any) => {
        this.email.set(user.email);
        this.isGoogleUser.set(!!user.googleSub);
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

  openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordDialog, {
      width: '420px',
      panelClass: 'custom-dialog',
      disableClose: false,
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      }
    });
  }

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
