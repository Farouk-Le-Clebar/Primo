import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import type { MultiPolygon } from 'typeorm';

@Entity('encadrement_loyers')
export class EncadrementLoyer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'territoire', length: 32 })
  territoire: string;

  @Column({ name: 'periode', length: 16 })
  periode: string;

  @Column({ name: 'zone', type: 'text', nullable: true })
  zone: string;

  @Column({ name: 'nombre_pieces', type: 'int' })
  nombre_pieces: number;

  @Column({ name: 'epoque', length: 32 })
  epoque: string;

  @Column({ name: 'annee_min', type: 'int', nullable: true })
  annee_min: number;

  @Column({ name: 'annee_max', type: 'int', nullable: true })
  annee_max: number;

  @Column({ name: 'meuble', type: 'boolean' })
  meuble: boolean;

  @Column({ name: 'loyer_reference', type: 'decimal', precision: 6, scale: 2 })
  loyer_reference: number;

  @Column({ name: 'loyer_majore', type: 'decimal', precision: 6, scale: 2 })
  loyer_majore: number;

  @Column({ name: 'loyer_minore', type: 'decimal', precision: 6, scale: 2 })
  loyer_minore: number;

  @Column({
    name: 'geom',
    type: 'geometry',
    spatialFeatureType: 'MultiPolygon',
    srid: 4326,
    select: false,
  })
  @Index({ spatial: true })
  geom: MultiPolygon;
}
