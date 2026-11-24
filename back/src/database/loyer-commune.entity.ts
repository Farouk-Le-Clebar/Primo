import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('loyers_communes')
export class LoyerCommune {
  @PrimaryColumn({ name: 'code_commune', length: 5 })
  code_commune: string;

  @PrimaryColumn({ name: 'type_bien', length: 32 })
  type_bien: string;

  @Column({ name: 'annee', type: 'int' })
  annee: number;

  @Column({ name: 'loyer_m2', type: 'decimal', precision: 6, scale: 2 })
  loyer_m2: number;

  @Column({
    name: 'loyer_m2_bas',
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
  })
  loyer_m2_bas: number;

  @Column({
    name: 'loyer_m2_haut',
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
  })
  loyer_m2_haut: number;

  @Column({ name: 'echelle', length: 16, nullable: true })
  echelle: string;

  @Column({ name: 'nombre_annonces', type: 'int', nullable: true })
  nombre_annonces: number;
}
