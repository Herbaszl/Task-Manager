import {DataSource} from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

function getEnv(key: string): string{
    const value = process.env[key];

    if(!value){
        throw new Error(`Erro: Variável de ambiente ${key} não definida.`)
    }

    return value;
}


function getPort(): number{
    const portString = getEnv('DB_PORT');
    const port = parseInt(portString, 10);
    
    if(isNaN(port)){
        throw new Error(`Erro: DB_PORT ('${portString}' não é um número válido)`)

    }
    return port
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: getEnv('DB_HOST'),
    port: getPort(),
    username: getEnv('DB_USER'),
    password: getEnv('DB_PASSWORD'),
    database: getEnv('DB_DATABASE'),
    entities: [__dirname + '/src/**/*.entity{.ts, .js}'],
    migrations: [__dirname + '/src/migrations/*{.ts, .js}'],
    synchronize: false,
})
