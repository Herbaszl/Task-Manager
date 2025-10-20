import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>
    ){}

    async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task>{
        const task = this.tasksRepository.create({
            ...createTaskDto, user:{id: userId},
        });
        return this.tasksRepository.save(task);
    }

    async findAll(userId: string): Promise<Task[]>{
        return this.tasksRepository.find({
            where: {user: {id: userId}},
        });
    }


    async findOneOrFail(id: string, userId: string): Promise<Task>{
        const task = await this.tasksRepository.findOne({
            where: {id, user: {id: userId}},
        });
        if(!task){
            throw new NotFoundException('Tarefa não encontrada')
        }
        return task;
    }

    async update(
        id:string,
        updateTaskDto: UpdateTaskDto,
        userId: string,

    ): Promise<Task>{
        const task = await this.findOneOrFail(id, userId);

        Object.assign(task, updateTaskDto);

        return this.tasksRepository.save(task);
    }

   async remove(id: string, userId: string): Promise<void>{
    const result = await this.tasksRepository.softDelete({
        id,
        user: {id: userId}, 
    });

    
    if(result.affected === 0 ){
        throw new NotFoundException('Tarefa não encontrada ou não pertence ao usuário');
    }
}
}


