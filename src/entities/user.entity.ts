import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserTypesEnum } from '../enums/user-type-enum';

@Entity()
export class BebaUser {

    @PrimaryGeneratedColumn("uuid")
    Id: string;

    @Column()
    Name: string;

    @Column({ unique: true })
    Email: string;

    @Column()
    Password: string;

    @Column()
    Age: number;

    @Column({ default: false })
    IsVerified: boolean;

    @Column({
        // type: 'enum',
        // enum: UserTypesEnum,
        default: UserTypesEnum.PARENT
    })
    Type: UserTypesEnum;

    @Column({ default: false })
    SubscribeToMarketing: boolean;
}