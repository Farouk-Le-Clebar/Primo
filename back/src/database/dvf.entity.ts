import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('dvf_mutations')
export class DvfMutation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_mutation', length: 32, nullable: true })
  @Index()
  id_mutation: string;

  @Column({ name: 'id_parcelle', length: 14 })
  @Index()
  id_parcelle: string;

  @Column({ name: 'date_mutation', type: 'date', nullable: true })
  date_mutation: Date;

  @Column({ name: 'numero_disposition', length: 16, nullable: true })
  numero_disposition: string;

  @Column({ name: 'nature_mutation', length: 255, nullable: true })
  nature_mutation: string;

  @Column({
    name: 'valeur_fonciere',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  valeur_fonciere: number;

  @Column({ name: 'code_commune', length: 5, nullable: true })
  code_commune: string;

  @Column({ name: 'adresse_numero', length: 16, nullable: true })
  adresse_numero: string;

  @Column({ name: 'adresse_suffixe', length: 16, nullable: true })
  adresse_suffixe: string;

  @Column({ name: 'adresse_nom_voie', length: 255, nullable: true })
  adresse_nom_voie: string;

  @Column({ name: 'code_postal', length: 5, nullable: true })
  code_postal: string;

  @Column({ name: 'lot1_numero', length: 32, nullable: true })
  lot1_numero: string;

  @Column({
    name: 'lot1_surface_carrez',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  lot1_surface_carrez: number;

  @Column({ name: 'lot2_numero', length: 32, nullable: true })
  lot2_numero: string;

  @Column({
    name: 'lot2_surface_carrez',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  lot2_surface_carrez: number;

  @Column({ name: 'nombre_lots', type: 'int', nullable: true })
  nombre_lots: number;

  @Column({ name: 'code_type_local', length: 4, nullable: true })
  code_type_local: string;

  @Column({ name: 'type_local', length: 255, nullable: true })
  type_local: string;

  @Column({ name: 'surface_reelle_bati', type: 'int', nullable: true })
  surface_reelle_bati: number;

  @Column({ name: 'nombre_pieces_principales', type: 'int', nullable: true })
  nombre_pieces_principales: number;

  @Column({ name: 'code_nature_culture', length: 8, nullable: true })
  code_nature_culture: string;

  @Column({ name: 'nature_culture', length: 255, nullable: true })
  nature_culture: string;

  @Column({ name: 'surface_terrain', type: 'int', nullable: true })
  surface_terrain: number;

  @Column({ name: 'longitude', type: 'double precision', nullable: true })
  longitude: number;

  @Column({ name: 'latitude', type: 'double precision', nullable: true })
  latitude: number;
}
