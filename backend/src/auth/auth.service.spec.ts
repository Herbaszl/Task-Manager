import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUsersService = {
  create: jest.fn(),
  findOneByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test',
      email: 'test@example.com',
      password: 'password123',
    };
    const savedUser = { id: 'uuid', ...createUserDto } as User;

    it('deve registrar um novo usuário com sucesso', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(savedUser);

      const result = await service.register(createUserDto);

      expect(result).toEqual(savedUser);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('deve lançar ConflictException se o email já existir', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(savedUser);

      await expect(service.register(createUserDto)).rejects.toThrow(ConflictException);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockUser = {
      id: 'uuid',
      name: 'Test',
      email: email,
      password: 'hashedPassword',
    } as User;

    it('deve retornar o usuário (sem senha) se as credenciais forem válidas', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const { password: _, ...expectedResult } = mockUser;

      const result = await service.validateUser(email, password);

      expect(result).toEqual(expectedResult);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('deve retornar null se a senha estiver incorreta', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });
  });

  describe('login', () => {
    it('deve retornar um access_token JWT', async () => {
      const validatedUser = { email: 'test@example.com', id: 'user-uuid' };
      const expectedPayload = { email: validatedUser.email, sub: validatedUser.id };
      const mockToken = 'mockAccessToken';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(validatedUser);

      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
    });
  });
});