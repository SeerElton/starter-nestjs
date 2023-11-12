import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BebaBaby } from './baby.entity';

@Entity()
export class BebaBabyAdditionalInformation {

    @PrimaryGeneratedColumn("uuid")
    Id: string;

    @ManyToOne(type => BebaBaby, pm => pm.Id)
    @Column()
    BabyId: string;

    @Column({ nullable: true })
    PlaceOfBirth?: string;

    @Column()
    Ethnicity: string;

    @Column()
    HomeLanguage: string;
}