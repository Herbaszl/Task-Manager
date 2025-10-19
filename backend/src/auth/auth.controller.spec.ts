import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { ConflictException } from '@nestjs/common';

const mockAuthService = {
  register: jest.fn(),
  validateUser: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('deve chamar authService.register com o DTO correto e retornar o resultado', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Teste',
        email: 'test@exemplo.com',
        password: 'senhasenha',
      };

      const expectedResult = { id: 'uuid', name: 'Teste', email: 'test@exemplo.com' } as User;
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
      expect(service.register).toHaveBeenCalledTimes(1);
    });

    it('deve repassar as exceptions de authService.register', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test',
        email: 'Test@exemplo.com',
        password: 'senhasenha',
      };

      const expectedError = new ConflictException('Este email já está em uso');
      mockAuthService.register.mockRejectedValue(expectedError);

      await expect(controller.register(createUserDto)).rejects.toThrow(ConflictException);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });
  });
});