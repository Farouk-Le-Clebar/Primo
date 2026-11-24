import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
import type { Point } from 'typeorm';

@Entity('coproprietes')
export class Copropriete {
  @PrimaryColumn({ name: 'numero_immatriculation', length: 16 })
  numero_immatriculation: string;

  @Column({ name: 'nom_usage', type: 'text', nullable: true })
  nom_usage: string;

  @Column({ name: 'adresse_reference', type: 'text', nullable: true })
  adresse_reference: string;

  @Column({ name: 'code_commune', length: 5, nullable: true })
  code_commune: string;

  @Column({ name: 'id_parcelle_1', length: 14, nullable: true })
  @Index()
  id_parcelle_1: string;

  @Column({ name: 'id_parcelle_2', length: 14, nullable: true })
  @Index()
  id_parcelle_2: string;

  @Column({ name: 'id_parcelle_3', length: 14, nullable: true })
  @Index()
  id_parcelle_3: string;

  @Column({ name: 'nombre_parcelles', type: 'int', nullable: true })
  nombre_parcelles: number;

  @Column({ name: 'date_immatriculation', type: 'date', nullable: true })
  date_immatriculation: Date;

  @Column({ name: 'date_derniere_maj', type: 'date', nullable: true })
  date_derniere_maj: Date;

  @Column({ name: 'date_reglement', type: 'date', nullable: true })
  date_reglement: Date;

  @Column({ name: 'periode_construction', type: 'text', nullable: true })
  periode_construction: string;

  @Column({ name: 'type_syndic', type: 'text', nullable: true })
  type_syndic: string;

  @Column({ name: 'syndic', type: 'text', nullable: true })
  syndic: string;

  @Column({ name: 'mandat', type: 'text', nullable: true })
  mandat: string;

  @Column({ name: 'date_fin_mandat', type: 'date', nullable: true })
  date_fin_mandat: Date;

  @Column({ name: 'nombre_lots', type: 'int', nullable: true })
  nombre_lots: number;

  @Column({ name: 'nombre_lots_principaux', type: 'int', nullable: true })
  nombre_lots_principaux: number;

  @Column({ name: 'nombre_lots_habitation', type: 'int', nullable: true })
  nombre_lots_habitation: number;

  @Column({ name: 'nombre_lots_stationnement', type: 'int', nullable: true })
  nombre_lots_stationnement: number;

  @Column({ name: 'residence_service', type: 'boolean', nullable: true })
  residence_service: boolean;

  @Column({ name: 'syndicat_principal', type: 'boolean', nullable: true })
  syndicat_principal: boolean;

  @Column({ name: 'copro_aidee', type: 'boolean', nullable: true })
  copro_aidee: boolean;

  @Column({ name: 'quartier_prioritaire', type: 'text', nullable: true })
  quartier_prioritaire: string;

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
