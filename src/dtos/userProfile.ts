import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserTypesEnum } from '../enums/user-type-enum';

@Entity()
export class UserProfile {
    Id: string;
    Name: string;
    Email: string;
    Age: number;
    UserId?: string;
    @Column({
        type: 'enum',
        enum: UserTypesEnum
    })
    Type: UserTypesEnum;
    SubscribeToMarketing: boolean;
    IsVerified: boolean;
}