import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificamos que no haya peticiones pendientes sin responder
    httpMock.verify();
  });

  it('should send a PATCH request to update profile with correct data', () => {
    const mockData = {
      name: 'John Doe',
      photoUrl: 'http://example.com/photo.jpg',
      birthDate: '1990-01-01'
    };

    service.updateProfile(mockData).subscribe();

    // Interceptamos la petición
    const req = httpMock.expectOne(`${environment.apiUrl}/user/profile`);

    // Verificaciones
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockData);
    expect(req.request.withCredentials).toBe(true);

    // Respondemos con algo dummy para cerrar la petición
    req.flush({ success: true });
  });

  it('should call getProfile endpoint with GET method', () => {
    service.getProfile().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/user/profile`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
