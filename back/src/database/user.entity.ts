import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, default: '' })
  firstName: string;

  @Column({ type: 'varchar', nullable: false, default: '' })
  surName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  profilePicture: string | null;

  @Column({ type: 'varchar', nullable: false, default: 'basic' })
  mapPreference: string;
}
