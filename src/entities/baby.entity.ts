import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, ManyToOne } from 'typeorm';
import { BebaUser } from './user.entity';
import { Gender } from '../enums/gender.enum';

@Entity()
export class BebaBaby {
    @PrimaryGeneratedColumn("uuid")
    Id: string;

    @ManyToOne(type => BebaUser, pm => pm.Id)
    @Column()
    UserId: string;

    @Column()
    RelationshipWithUser: string;

    @Column()
    Name: string;

    @Column({
        type: 'enum',
        enum: Gender
    })
    Gender: Gender;

    @Column()
    DOB: Date;

    @Column({})
    @Column({ type: 'longtext' })
    Picture: string;

    @Column({ type: 'double' })
    WeightAtBirth: number;

    @Column({ type: 'double' })
    HeightAtBirth: number;

    @Column({ type: 'double' })
    HeadCircumferenceAtBirth: number;
}