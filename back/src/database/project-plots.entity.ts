import { Column, Entity } from "typeorm";

@Entity('project_plots')
export class ProjectPlots {
    @Column({ type: 'uuid', primary: true })
    id: string;

    @Column({ type: 'uuid', nullable: false })
    projectId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    plotId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    plotBanId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    adress: string;

    @Column({ type: 'text', nullable: true })
    aiNotes: string | null;
}