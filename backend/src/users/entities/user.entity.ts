import {Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column, CreateDateColumn, DeleteDateColumn, BeforeInsert} from 'typeorm'
import * as bcrypt from 'bcrypt';

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name: string;

    @Column ({unique: true})
    email: string;

    @Column()
    password: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at', nullable: true})
    deletedAt: Date;

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 10)
    }
}