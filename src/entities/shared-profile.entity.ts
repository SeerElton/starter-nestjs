import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from 'typeorm';
import { BebaUser } from './user.entity';
import { Permission } from '../enums/permission.enum';
import { BebaBaby } from './baby.entity';

@Entity()
export class BebaBabySharedProfile {
    @PrimaryGeneratedColumn("uuid")
    Id: string;

    @Column()
    Email: string;

    @Column()
    @ManyToOne(type => BebaBaby, pm => pm.Id)
    BabyId: string;

    @Column({
        // type: 'enum',
        // enum: Permission
    })
    Permission: Permission;
}