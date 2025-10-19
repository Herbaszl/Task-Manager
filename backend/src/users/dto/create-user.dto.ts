import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';

export class CreateUserDto{
    @IsString()
    @IsNotEmpty({message: 'O nome nao pode estar vazio'})
    name: string;

    @IsEmail({}, {message: 'Por favor, insira um email válido'})
    @IsNotEmpty({message: 'O email não pode estar vazio'})
    email: string;

    @IsString()
    @IsNotEmpty({message: 'A senha nao pode estar vazia'})
    @MinLength(8, {message: 'A senha deve ter pelo menos 8 caracteres'})
    password: string;
}