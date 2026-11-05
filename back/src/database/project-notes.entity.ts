import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('project_notes')
export class ProjectNotes {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid', nullable: false })
    projectId: string;

    @Column({ type: 'varchar', length: 255, default: '' })
    title: string;

    // Markdown source.
    @Column({ type: 'text', default: '' })
    content: string;

    // Incremented on every update: the client sends the version it edited, a mismatch means a conflict.
    @Column({ type: 'int', default: 1 })
    version: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    createdBy: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    updatedBy: string | null;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
