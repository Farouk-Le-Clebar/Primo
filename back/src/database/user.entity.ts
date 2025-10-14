import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', nullable: false, default: '' })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: null })
  profilePicture: string;
}
