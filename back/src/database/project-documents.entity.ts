import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('project_documents')
export class ProjectDocuments {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    projectId: string;

    @Column()
    documentName: string;

    @Column()
    mimetype: string;

    @Column()
    documentType: string;

    @Column({ type: 'varchar', length: 512 })
    storageKey: string;

    @Column({ type: 'int', default: 0 })
    size: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    uploadedBy: string | null;

    @Column({ type: 'boolean', default: false })
    isUploaded: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
