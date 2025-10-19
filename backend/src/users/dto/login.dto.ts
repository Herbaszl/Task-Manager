import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class LoginDto{
    @IsEmail({}, {message: 'Email ou senha invalidos'})
    @IsNotEmpty({message: 'Email ou senha inváliidos'})
    email: string;

    @IsString()
    @IsNotEmpty({message: 'Email ou senha inválidos'})
    password: string;
}