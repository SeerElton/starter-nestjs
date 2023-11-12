import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BebaBaby } from './baby.entity';

@Entity()
export class BebaPersonalMilestone {

    @PrimaryGeneratedColumn("uuid")
    Id: string;

    @ManyToOne(type => BebaBaby, pm => pm.Id)
    @Column()
    BabyId: string;

    @Column({ nullable: true })
    Type?: string;

    @Column()
    Date: string;

    @Column()
    Milestone: string;

    @Column({ default: false })
    IsUseful?: boolean;
}