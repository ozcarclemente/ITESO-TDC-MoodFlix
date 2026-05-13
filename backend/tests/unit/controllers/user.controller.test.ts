import { getProfile } from '../../../src/controllers/user.controller';
import { User } from '../../../src/models/user.model';
import { Response } from 'express';
import { AuthRequest } from '../../../src/middlewares/auth.middleware';

// Mockeamos el modelo de User de Mongoose
jest.mock('../../../src/models/user.model');

describe('UserController - getProfile', () => {
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let jsonSpy = jest.fn();
    let statusSpy = jest.fn().mockReturnThis();

    beforeEach(() => {
        jest.clearAllMocks();

        mockRequest = {
            userId: 'some-user-id'
        };

        mockResponse = {
            status: statusSpy,
            json: jsonSpy
        };
    });

    it('should return 404 if user is not found in database', async () => {
        // En Mongoose, findById().select() es una cadena de promesas.
        // Para mockearlo correctamente, necesitamos que findById retorne un objeto con select
        // y que select retorne null (que es lo que pasa cuando no hay usuario).
        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });

        await getProfile(mockRequest as AuthRequest, mockResponse as Response);

        // Verificaciones
        expect(statusSpy).toHaveBeenCalledWith(404);
        expect(jsonSpy).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 if there is a database error', async () => {
        // Simulamos que la base de datos lanza un error de conexión o sintaxis
        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockRejectedValue(new Error('DB Connection Error'))
        });

        await getProfile(mockRequest as AuthRequest, mockResponse as Response);

        expect(statusSpy).toHaveBeenCalledWith(500);
        expect(jsonSpy).toHaveBeenCalledWith({ message: 'Error fetching profile' });
    });
});
