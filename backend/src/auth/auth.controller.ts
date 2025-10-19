import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import {AuthService} from  './auth.service';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('Register')
    async register(@Body() createUserDto: CreateUserDto){
        return this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto){
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );
        if (!user){
            throw new UnauthorizedException('Email ou senha inválidos');
        }
        return this.authService.login(user);
    }
}

