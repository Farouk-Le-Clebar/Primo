import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('project_members')
export class ProjectMembers {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    userId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    projectId: string;

    @Column({ type: 'boolean', default: false })
    isAdmin: boolean;

    @Column({ type: 'varchar', length: 255, default: 'member' })
    role: string;

    @Column({ type: 'boolean', default: true })
    isPending: boolean;

    @Column({ type: 'timestamp', nullable: true })
    joinedAt: Date;

    @Column({ type: 'boolean', default: false })
    isFavorite: boolean;
}
