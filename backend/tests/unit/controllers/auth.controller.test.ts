import { AuthController } from '../../../src/controllers/auth.controller';
import { AuthService } from '../../../src/services/auth.service';
import { Request, Response } from 'express';

// Mockeamos el AuthService para que no use la DB real
jest.mock('../../../src/services/auth.service');

describe('AuthController - login', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonSpy = jest.fn();
    let statusSpy = jest.fn().mockReturnThis(); // .mockReturnThis() permite encadenar: res.status().json()

    beforeEach(() => {
        // Limpiamos los mocks antes de cada test
        jest.clearAllMocks();
        
        mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'wrongpassword'
            }
        };

        mockResponse = {
            status: statusSpy,
            json: jsonSpy,
            cookie: jest.fn(),
        };
    });

    it('should return 401 if AuthService.login throws an error (invalid credentials)', async () => {
        // Configuramos el mock para que lance el error de credenciales inválidas
        (AuthService.login as jest.Mock).mockRejectedValue(new Error('Email o contraseña inválidos'));

        await AuthController.login(mockRequest as Request, mockResponse as Response);

        // Verificamos que se haya llamado al status 401
        expect(statusSpy).toHaveBeenCalledWith(401);
        
        // Verificamos que el mensaje de error sea el esperado
        expect(jsonSpy).toHaveBeenCalledWith({
            message: 'Email o contraseña inválidos'
        });
    });

    it('should return 400 if email or password are missing', async () => {
        mockRequest.body = { email: 'onlyemail@test.com' }; // Falta password

        await AuthController.login(mockRequest as Request, mockResponse as Response);

        expect(statusSpy).toHaveBeenCalledWith(400);
        expect(jsonSpy).toHaveBeenCalledWith({
            message: 'Email y contraseña requeridos'
        });
    });
});
