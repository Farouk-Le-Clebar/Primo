import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserStatistics {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    userId: string;

    @Column({ type: 'int', nullable: false, default: 0 })
    connectionCount: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastConnection: Date;
}
