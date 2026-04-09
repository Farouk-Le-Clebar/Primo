import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VerifiedUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, default: '' })
  userId: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  emailSent: boolean;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  lastEmailDate: Date;

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string | null;
}
