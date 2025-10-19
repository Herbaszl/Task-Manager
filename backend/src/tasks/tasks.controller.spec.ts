import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {Task, TaskStatus} from './entities/task.entity'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


const mockTasksService = {
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockRequestWithUser = {
  user:{
    userId: 'user-uuid-test',
    email: 'test@example.com'
  },
};

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers:[
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard).useValue({canActivate: () => true}).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() =>{
    jest.clearAllMocks();
  });

  it('Deve ser definido', ( ) => {
    expect(controller).toBeDefined();
  });

  describe ('create', () => {
    it('Deve chamar o tasksService.create e retornar um resultado', async () =>  {
      const createTaskDto: CreateTaskDto = {title: 'Testando', description: 'Descrição de testes'};
      const expectedResult = {id: '1', ...createTaskDto, status: TaskStatus.PENDING} as Task;
      mockTasksService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTaskDto, mockRequestWithUser);

      expect(result).toEqual(expectedResult);
      
      expect(service.create).toHaveBeenCalledWith(createTaskDto, mockRequestWithUser.user.userId);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });


  describe('findAll', () => {
    it('deve chamar tasksService.findAll e retornar algo', async () => {
      const expectedResult: Task[] = [{id: '1', title: 'Task 1', status:TaskStatus.PENDING} as Task];
      mockTasksService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequestWithUser);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenLastCalledWith(mockRequestWithUser.user.userId);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('deve chamar tasksService.update e retornar algo', async () => {
      const taskId = 'task-uuid-to-update';
      const updateTaskDto : UpdateTaskDto = {title: 'Updated'};
      const expectedResult = {id: taskId, title: 'Updated', status: TaskStatus.PENDING} as Task;
      
      mockTasksService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(taskId, updateTaskDto, mockRequestWithUser);

      expect(result).toEqual(expectedResult);
        expect(service.update).toHaveBeenCalledWith(taskId, updateTaskDto, mockRequestWithUser.user.userId);
        expect(service.update).toHaveBeenCalledTimes(1);
    });
  });


  describe('remove', () => {
      it('deve chamar tasksService.remove', async () => {
          const taskId = 'task-uuid-to-remove';
          mockTasksService.remove.mockResolvedValue(undefined); 

          await controller.remove(taskId, mockRequestWithUser);

          expect(service.remove).toHaveBeenCalledWith(taskId, mockRequestWithUser.user.userId);
          expect(service.remove).toHaveBeenCalledTimes(1);
      });
  });



})