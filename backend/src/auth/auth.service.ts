import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/users/dto/create-user.dto';



@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}


    async register(createUserDto: CreateUserDto){
        const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
        if(existingUser){
            throw new ConflictException('Este email já está em uso');
        }

        return this.usersService.create(createUserDto);
    }

    async validateUser(email: string, pass: string): Promise<any>{
        const user = await this.usersService.findOneByEmail(email);
        if(user && (await bcrypt.compare(pass, user.password))){
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: any){
        const payload = {email: user.email, sub: user.id}
        return{
            access_token: this.jwtService.sign(payload),
        };
    }
}
