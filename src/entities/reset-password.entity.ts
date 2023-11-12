import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BebaResetPassword {

    @PrimaryGeneratedColumn("uuid")
    Id?: string;

    @Column()
    Password: string;

    @Column({ unique: true })
    UserEmail: string;
}