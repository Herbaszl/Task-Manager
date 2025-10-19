import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {JwtAuthGuard} from 'src/auth/jwt-auth.guard'
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor (private readonly tasksService: TasksService) {}

    @Post()
    create(@Body() createTaskDto: CreateTaskDto, @Request() req){
        const userId = req.user.userId;
        return this.tasksService.create(createTaskDto, userId)
    }

    @Get()
    findAll(@Request () req){
        const userId = req.user.userId;
        return this.tasksService.findAll(userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() req,
    ){
        const userId = req.user.userId;
        return this.tasksService.update(id, updateTaskDto, userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req){
        const userId = req.user.userId;
        return this.tasksService.remove(id, userId);
    }
}
