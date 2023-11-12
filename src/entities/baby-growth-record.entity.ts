import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from 'typeorm';
import { UserTypesEnum } from '../enums/user-type-enum';
import { BebaBaby } from './baby.entity';

@Entity()
export class BebaBabyGrowthRecord {

    @PrimaryGeneratedColumn("uuid")
    Id: string;

    @ManyToOne(type => BebaBaby, pm => pm.Id)
    @Column()
    BabyId: string;

    @Column({ type: 'double' })
    Weight: number;

    @Column({ type: 'double' })
    Height: number;

    @Column({ type: 'double' })
    HeadCircumference: number;

    @Column()
    Date: Date;
}