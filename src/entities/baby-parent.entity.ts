import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { BebaUser } from './user.entity';
import { Permission } from '../enums/permission.enum';

@Entity()
export class BebaBabyParent {
    @PrimaryGeneratedColumn("uuid")
    Id: string;

    @ManyToMany(type => BebaUser, pm => pm.Id)
    @Column()
    UserId: string;

    @Column()
    BabyId: string;
}