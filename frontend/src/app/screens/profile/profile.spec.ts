import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Profile } from './profile';
import { UserService } from '../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('Profile Component', () => {
  let component: Profile;
  let userServiceMock: any;
  let dialogMock: any;

  beforeEach(async () => {
    userServiceMock = {
      getProfile: vi.fn().mockReturnValue(of({ name: 'Test User', email: 'test@test.com' })),
      uploadAvatar: vi.fn(),
      setUserPhoto: vi.fn()
    };

    dialogMock = {
      open: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Profile, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set error message when file is larger than 5MB', () => {
    // Creamos un archivo simulado de 6MB (6 * 1024 * 1024 bytes)
    const largeFile = new File([''], 'large-image.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    // Simulamos el evento de input file
    const event = {
      target: {
        files: [largeFile]
      }
    };

    component.onFileSelected(event);

    expect(component.errorMessage()).toBe('La imagen debe pesar menos de 5MB');
    expect(userServiceMock.uploadAvatar).not.toHaveBeenCalled();
  });

  it('should NOT set error message and call upload when file is smaller than 5MB', () => {
    const smallFile = new File([''], 'small-image.png', { type: 'image/png' });
    Object.defineProperty(smallFile, 'size', { value: 2 * 1024 * 1024 }); // 2MB

    const event = {
      target: {
        files: [smallFile]
      }
    };

    // Mockeamos la respuesta del servicio para que no falle al suscribirse
    userServiceMock.uploadAvatar.mockReturnValue(of({ user: { photoUrl: 'http://example.com/photo.jpg' } }));

    component.onFileSelected(event);

    expect(component.errorMessage()).toBeNull();
    expect(userServiceMock.uploadAvatar).toHaveBeenCalled();
  });
});
