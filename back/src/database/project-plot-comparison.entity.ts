import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export type ComparisonStatus = 'pending' | 'completed' | 'failed';

// Plots are referenced by id without a foreign key on purpose: the snapshot below keeps the comparison readable
// even after one of the two plots has been removed from the project.
@Entity('project_plot_comparisons')
export class ProjectPlotComparison {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid', nullable: false })
    projectId: string;

    @Column({ type: 'uuid', nullable: false })
    plotAId: string;

    @Column({ type: 'uuid', nullable: false })
    plotBId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    plotALabel: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    plotBLabel: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    createdBy: string | null;

    // Free-text brief written by the user (budget, project type...) to steer the analysis.
    @Column({ type: 'text', nullable: true })
    question: string | null;

    @Column({ type: 'varchar', length: 16, default: 'pending' })
    status: ComparisonStatus;

    @Column({ type: 'varchar', length: 128, nullable: true })
    model: string | null;

    // Exactly what the model is given: reproducible and auditable.
    @Column({ type: 'jsonb', nullable: true, select: false })
    inputSnapshot: Record<string, any> | null;

    // Structured answer of the model (see ComparisonResult).
    @Column({ type: 'jsonb', nullable: true })
    result: Record<string, any> | null;

    @Column({ type: 'text', nullable: true })
    errorMessage: string | null;

    // timestamptz: a plain timestamp is read back in the server's local zone and shifts by the UTC offset.
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamptz', nullable: true })
    completedAt: Date | null;
}
