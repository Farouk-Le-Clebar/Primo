import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import type { Point } from 'typeorm';

@Entity('rpls_logements')
export class RplsLogement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code_commune', length: 5, nullable: true })
  code_commune: string;

  @Column({ name: 'adresse', type: 'text', nullable: true })
  adresse: string;

  @Column({ name: 'code_postal', length: 5, nullable: true })
  code_postal: string;

  @Column({ name: 'nom_programme', type: 'text', nullable: true })
  nom_programme: string;

  @Column({ name: 'etage', type: 'int', nullable: true })
  etage: number;

  @Column({ name: 'nombre_pieces', type: 'int', nullable: true })
  nombre_pieces: number;

  @Column({
    name: 'surface_habitable',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  surface_habitable: number;

  @Column({ name: 'annee_construction', type: 'int', nullable: true })
  annee_construction: number;

  @Column({ name: 'annee_mise_en_location', type: 'int', nullable: true })
  annee_mise_en_location: number;

  @Column({ name: 'type_construction', type: 'text', nullable: true })
  type_construction: string;

  @Column({ name: 'financement', type: 'text', nullable: true })
  financement: string;

  @Column({ name: 'conventionne', type: 'boolean', nullable: true })
  conventionne: boolean;

  @Column({ name: 'dpe_energie', length: 1, nullable: true })
  dpe_energie: string;

  @Column({ name: 'dpe_ges', length: 1, nullable: true })
  dpe_ges: string;

  @Column({ name: 'dpe_date', type: 'text', nullable: true })
  dpe_date: string;

  @Column({ name: 'accessibilite_pmr', type: 'text', nullable: true })
  accessibilite_pmr: string;

  @Column({ name: 'quartier_prioritaire', type: 'text', nullable: true })
  quartier_prioritaire: string;

  @Column({ name: 'qualite_geolocalisation', type: 'text', nullable: true })
  qualite_geolocalisation: string;

  @Column({
    name: 'geom',
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
    select: false,
  })
  @Index({ spatial: true })
  geom: Point;
}
