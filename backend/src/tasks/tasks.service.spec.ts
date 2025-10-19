import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { ObjectLiteral } from 'typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = (): MockRepository<Task> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let tasksRepository: MockRepository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: createMockRepository(),
        },
      ],
    }).compile();
    service = module.get<TasksService>(TasksService);
    tasksRepository = module.get<MockRepository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma array de tasks para um usuário', async () => {
      const userId = 'user-uuid-123';
      const mockTasks: Task[] = [
        { id: 'task-uuid-1', title: 'Testando Tarefa' } as Task,
      ];

      tasksRepository.find!.mockResolvedValue(mockTasks);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockTasks);

      expect(tasksRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
    });
  });

  describe('remove', () => {
    it('Deve chamar softDelete com os parâmetros corretos', async () => {
      const userId = 'user-uuid-123';
      const taskId = 'task-uuid-456';

      tasksRepository.softDelete!.mockResolvedValue({ affected: 1 });

      await service.remove(taskId, userId);

      expect(tasksRepository.softDelete!).toHaveBeenCalledWith({
        id: taskId,
        user: { id: userId },
      });
    });

    it('Deve acusar NotFoundException se nenhuma tarefa for deletada', async () => {
      const userId = 'user-uuid-123';
      const taskId = 'task-uuid-456';

      tasksRepository.softDelete!.mockResolvedValue({ affected: 0 });
      await expect(service.remove(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});