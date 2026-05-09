import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('projects')
export class Projects {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'int', default: 0 })
    numberOfPlots: number;

    @Column({ type: 'int', default: 1 })
    numberOfMembers: number;
}