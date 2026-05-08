import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('dpe', { synchronize: false })
@Index(['identifiant_ban'])
export class DpeEntity { 

  @PrimaryGeneratedColumn({ name: 'OGR_FID' })
  ogrFid: number;

  @Column({ name: 'numero_dpe', type: 'text', nullable: true })
  numero_dpe: string;

  @Column({ name: 'identifiant_ban', type: 'varchar', length: 50, nullable: true })
  @Index()
  identifiant_ban: string;

  @Column({ name: 'id_rnb', type: 'text', nullable: true })
  id_rnb: string;

  @Column({ name: 'etiquette_dpe', type: 'text', nullable: true })
  etiquette_dpe: string;

  @Column({ name: 'etiquette_ges', type: 'text', nullable: true })
  etiquette_ges: string;

  @Column({ name: 'coordonnee_cartographique_x_ban', type: 'text', nullable: true })
  coordonnee_cartographique_x_ban: string;

  @Column({ name: 'coordonnee_cartographique_y_ban', type: 'text', nullable: true })
  coordonnee_cartographique_y_ban: string;

  @Column({ name: 'adresse_ban', type: 'text', nullable: true })
  adresse_ban: string;

  @Column({ name: 'code_postal_ban', type: 'text', nullable: true })
  code_postal_ban: string;

  @Column({ name: 'nom_commune_ban', type: 'text', nullable: true })
  nom_commune_ban: string;

  @Column({ name: 'score_ban', type: 'text', nullable: true })
  score_ban: string;

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

  @Column({ name: 'type_installation_chauffage', type: 'text', nullable: true })
  type_installation_chauffage: string;

  @Column({ name: 'type_energie_principale_chauffage', type: 'text', nullable: true })
  type_energie_principale_chauffage: string;

  @Column({ name: 'type_installation_ecs', type: 'text', nullable: true })
  type_installation_ecs: string;

  @Column({ name: 'type_energie_principale_ecs', type: 'text', nullable: true })
  type_energie_principale_ecs: string;

  @Column({ name: 'logement_etage', type: 'text', nullable: true })
  logement_etage: string;

  @Column({ name: 'logement_porte', type: 'text', nullable: true })
  logement_porte: string;

  @Column({ name: 'code_unite_habitation', type: 'text', nullable: true })
  code_unite_habitation: string;

  @Column({ name: 'surface_habitable_desservie', type: 'text', nullable: true })
  surface_habitable_desservie: string;

  @Column({ name: 'methode_application_dpe', type: 'text', nullable: true })
  methode_application_dpe: string;

  @Column({ name: 'qualite_isolation_enveloppe', type: 'text', nullable: true })
  qualite_isolation_enveloppe: string;

  @Column({ name: 'qualite_isolation_menuiseries', type: 'text', nullable: true })
  qualite_isolation_menuiseries: string;

  @Column({ name: 'surface_parois_opaques', type: 'text', nullable: true })
  surface_parois_opaques: string;

  @Column({ name: 'surface_vitree_totale', type: 'text', nullable: true })
  surface_vitree_totale: string;

  @Column({ name: 'type_vitrage', type: 'text', nullable: true })
  type_vitrage: string;

  @Column({ name: 'u_baie', type: 'text', nullable: true })
  u_baie: string;

  @Column({ name: 'u_mur', type: 'text', nullable: true })
  u_mur: string;

  @Column({ name: 'type_ventilation', type: 'text', nullable: true })
  type_ventilation: string;

  @Column({ name: 'conso_5_usages_ep_m2_an', type: 'text', nullable: true })
  conso_5_usages_ep_m2_an: string;

  @Column({ name: 'emission_ges_5_usages_m2_an', type: 'text', nullable: true })
  emission_ges_5_usages_m2_an: string;

  @Column({ name: 'cout_total_5_usages', type: 'text', nullable: true })
  cout_total_5_usages: string;

  @Column({ name: 'conso_chauffage_depense_2', type: 'text', nullable: true })
  conso_chauffage_depense_2: string;

  @Column({ name: 'conso_ecs_depense_2', type: 'text', nullable: true })
  conso_ecs_depense_2: string;

  @Column({ name: 'conso_refroidissement_depense_2', type: 'text', nullable: true })
  conso_refroidissement_depense_2: string;

  @Column({ name: 'conso_eclairage_depense_2', type: 'text', nullable: true })
  conso_eclairage_depense_2: string;
}