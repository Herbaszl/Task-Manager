import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {  ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from "passport-jwt";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService){
        const secret = configService.get<string>('JWT_SECRET');
        if(!secret){
            throw new Error('JWT_SECRET nãoe está definido corretamente no .env, portanto, a aplicação não pode iniciar.')
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }
    
        async validate(payload: any){
            return {userId: payload.sub, email: payload.email};
        }
}