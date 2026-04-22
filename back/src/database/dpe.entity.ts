import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('dpe_logements_existants', { synchronize: false })
@Index(['identifiant_ban'])
export class DpeLogement {

  @PrimaryGeneratedColumn({ name: 'OGR_FID' })
  ogrFid: number;

  @Column({ name: 'numero_dpe', type: 'text', nullable: true })
  numero_dpe: string;

  @Column({
    name: 'identifiant_ban',
    type: 'varchar',
    length: 50,
    nullable: true,
  })

  @Index()
  identifiant_ban: string;

  @Column({ name: 'etiquette_dpe', type: 'text', nullable: true })
  etiquette_dpe: string;

  @Column({ name: 'etiquette_ges', type: 'text', nullable: true })
  etiquette_ges: string;

  @Column({ name: 'adresse_ban', type: 'text', nullable: true })
  adresse_ban: string;

  @Column({ name: 'code_postal_ban', type: 'text', nullable: true })
  code_postal_ban: string;

  @Column({ name: 'nom_commune_ban', type: 'text', nullable: true })
  nom_commune_ban: string;

  @Column({ name: 'annee_construction', type: 'text', nullable: true })
  annee_construction: string;

  @Column({ name: 'surface_habitable_logement', type: 'text', nullable: true })
  surface_habitable_logement: string;

  @Column({ name: 'type_batiment', type: 'text', nullable: true })
  type_batiment: string;

  @Column({ name: 'date_etablissement_dpe', type: 'text', nullable: true })
  date_etablissement_dpe: string;

  @Column({ name: 'date_fin_validite_dpe', type: 'text', nullable: true })
  date_fin_validite_dpe: string;

  @Column({ name: 'conso_5_usages_ep_m2_an', type: 'text', nullable: true })
  conso_5_usages_ep_m2_an: string;

  @Column({ name: 'emission_ges_5_usages_m2_an', type: 'text', nullable: true })
  emission_ges_5_usages_m2_an: string;

  @Column({ name: 'cout_total_5_usages', type: 'text', nullable: true })
  cout_total_5_usages: string;

  @Column({ name: 'type_energie_principale_chauffage', type: 'text', nullable: true })
  type_energie_principale_chauffage: string;

  @Column({ name: 'type_installation_chauffage', type: 'text', nullable: true })
  type_installation_chauffage: string;
}