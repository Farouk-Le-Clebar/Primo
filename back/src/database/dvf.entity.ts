import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('dvf_mutations')
@Index(['idParcelle'])
export class DvfMutation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_parcelle', length: 14 })
  idParcelle: string;

  @Column({ name: 'date_mutation', type: 'date', nullable: true })
  dateMutation: Date;

  @Column({ name: 'nature_mutation', nullable: true })
  natureMutation: string;

  @Column({ name: 'valeur_fonciere', type: 'decimal', precision: 12, scale: 2, nullable: true })
  valeurFonciere: number;

  @Column({ name: 'surface_reelle_bati', type: 'int', nullable: true })
  surfaceReelleBati: number;

  @Column({ name: 'type_local', nullable: true })
  typeLocal: string;
}