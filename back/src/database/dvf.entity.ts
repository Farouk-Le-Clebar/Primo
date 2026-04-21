import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('dvf_mutations')
export class DvfMutation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_parcelle', length: 14 })
  @Index()
  id_parcelle: string;

  @Column({ name: 'date_mutation', type: 'date', nullable: true })
  date_mutation: Date;

  @Column({ name: 'nature_mutation', length: 255, nullable: true })
  nature_mutation: string;

  @Column({ name: 'valeur_fonciere', type: 'decimal', precision: 12, scale: 2, nullable: true })
  valeur_fonciere: number;

  @Column({ name: 'surface_reelle_bati', type: 'int', nullable: true })
  surface_reelle_bati: number;

  @Column({ name: 'type_local', length: 255, nullable: true })
  type_local: string;
}