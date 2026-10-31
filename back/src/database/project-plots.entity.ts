import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type PlotEnrichmentErrors = Record<string, string>;

@Entity('project_plots')
export class ProjectPlots {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    projectId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    plotId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    plotBanId: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    coordinates: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    adress: string;

    @Column({ type: 'json', nullable: true })
    geometry: any;

    @Column({ type: 'text', nullable: true })
    aiNotes: string | null;

    // Parcel identity (cadastre).
    @Column({ type: 'varchar', length: 5, nullable: true })
    communeCode: string | null;

    @Column({ type: 'varchar', length: 3, nullable: true })
    department: string | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    prefix: string | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    section: string | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    parcelNumber: string | null;

    // Cadastral area in m² ("contenance").
    @Column({ type: 'double precision', nullable: true })
    surfaceM2: number | null;

    @Column({ type: 'double precision', nullable: true })
    centroidLongitude: number | null;

    @Column({ type: 'double precision', nullable: true })
    centroidLatitude: number | null;

    // Raw properties of the cadastre feature and of the Addok (BAN) address match.
    @Column({ type: 'jsonb', nullable: true })
    cadastreProperties: Record<string, any> | null;

    @Column({ type: 'jsonb', nullable: true })
    addressProperties: Record<string, any> | null;

    // Snapshots of every dataset available for a parcel, taken when it is added to the project.
    // Heavy: excluded from default selects, load them with addSelect.
    @Column({ type: 'jsonb', nullable: true, select: false })
    dvf: Record<string, any> | null;

    @Column({ type: 'jsonb', nullable: true, select: false })
    dpe: Record<string, any>[] | null;

    @Column({ type: 'jsonb', nullable: true, select: false })
    urbanPermits: Record<string, any>[] | null;

    @Column({ type: 'jsonb', nullable: true, select: false })
    plu: Record<string, any> | null;

    @Column({ type: 'jsonb', nullable: true, select: false })
    buildings: Record<string, any>[] | null;

    @Column({ type: 'jsonb', nullable: true, select: false })
    risks: Record<string, any>[] | null;

    @Column({ type: 'jsonb', nullable: true, select: false })
    climate: Record<string, any> | null;

    @Column({ type: 'jsonb', nullable: true, select: false })
    proximity: Record<string, any>[] | null;

    @Column({ type: 'timestamp', nullable: true })
    enrichedAt: Date | null;

    // Source name -> error message, for datasets that could not be fetched.
    @Column({ type: 'jsonb', nullable: true })
    enrichmentErrors: PlotEnrichmentErrors | null;
}
