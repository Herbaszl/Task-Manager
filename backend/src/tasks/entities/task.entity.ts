import {User} from 'src/users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'

export enum TaskStatus{
    PENDING = 'Pendente',
    IN_PROGRESS = 'Em Andamento',
    DONE = 'Finalizada'
}

@Entity({name: 'tasks'})
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    status: TaskStatus;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at', nullable: true})
    deletedAt: Date
}