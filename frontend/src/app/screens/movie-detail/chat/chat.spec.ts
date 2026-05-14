import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Chat } from './chat';
import { ChatService } from '../../../core/services/chat.service';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('Chat Component', () => {
  let component: Chat;
  let chatServiceMock: any;
  let userServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    chatServiceMock = {
      messages: signal([]),
      connected: signal(true), // Simulamos que está conectado
      connect: vi.fn(),
      disconnect: vi.fn(),
      joinRoom: vi.fn(),
      sendMessage: vi.fn()
    };

    userServiceMock = {
      getMe: vi.fn().mockReturnValue(of({ id: 'u1', name: 'Test User' })),
      getProfile: vi.fn().mockReturnValue(of({ photoUrl: 'img.png' })),
      setUserPhoto: vi.fn(),
      userPhoto$: of('img.png')
    };

    activatedRouteMock = {
      parent: {
        snapshot: {
          params: { id: 'm123' } // ID de la película
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [Chat],
      providers: [
        { provide: ChatService, useValue: chatServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(Chat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call chatService.sendMessage with correct parameters', () => {
    // 1. Configuramos el estado inicial
    component.inputText.set('Hola mundo');
    
    // 2. Ejecutamos la acción
    component.sendMessage();

    // 3. Verificamos que se llamó al servicio con:
    // movieId: 'm123' (de la ruta)
    // username: 'Test User' (de userService.getMe)
    // content: 'Hola mundo'
    expect(chatServiceMock.sendMessage).toHaveBeenCalledWith('m123', 'Test User', 'Hola mundo');
  });

  it('should clear input text after sending message', () => {
    component.inputText.set('Mensaje a borrar');
    component.sendMessage();
    expect(component.inputText()).toBe('');
  });

  it('should NOT call sendMessage if input is empty', () => {
    component.inputText.set('   '); // Solo espacios
    component.sendMessage();
    expect(chatServiceMock.sendMessage).not.toHaveBeenCalled();
  });

  it('should NOT call sendMessage if disconnected', () => {
    chatServiceMock.connected.set(false); // Simulamos desconexión
    component.inputText.set('Hola');
    
    component.sendMessage();
    
    expect(chatServiceMock.sendMessage).not.toHaveBeenCalled();
  });
});
