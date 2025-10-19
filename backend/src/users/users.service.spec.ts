import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = (): MockRepository<User> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um usuário com sucesso', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Usuário de Testes',
        email: 'teste@test.com',
        password: 'senhasenha',
      };

      const createdUserObject = { ...createUserDto, id: 'random-uuid' } as User;
      const savedUser = { ...createdUserObject, createdAt: new Date() } as User;

      usersRepository.create!.mockReturnValue(createdUserObject);
      usersRepository.save!.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(savedUser);
      expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(usersRepository.save).toHaveBeenCalledWith(createdUserObject); // Use toHaveBeenCalledWith aqui também
    });
  });

  describe('findOneByEmail', () => {
    it('deve encontrar e retornar um usuário através do email', async () => {
      const email = 'test@exemplo.com';
      const mockUser = { id: 'uuid', name: 'Usuário Teste', email: email, password: 'senha_segura' } as User;
      
      usersRepository.findOne!.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail(email);

      expect(result).toEqual(mockUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    });

    it('deve retornar nulo se o email não existir', async () => {
      const email = 'naoachei@perdi.com';
      
      usersRepository.findOne!.mockResolvedValue(null);

      const result = await service.findOneByEmail(email);

      expect(result).toBeNull();
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });
}); 