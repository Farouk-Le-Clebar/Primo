import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AutorisationsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getByParcelle(idParcelle: string) {
    const commune = idParcelle.slice(0, 5);
    const section = idParcelle.slice(8, 10);
    const numero = idParcelle.slice(10).replace(/^0+/, '') || '0';
    const sections = [...new Set([section, section.replace(/^0/, '')])];
    const numeros = [...new Set(Array.from({ length: 4 }, (_, i) => numero.padStart(i + 1, '0')))];

    // La table importée reste hors synchronisation TypeORM. Les trois références
    // déclarées sont recherchées ; le préfixe cadastral est absent de la source.
    return this.dataSource.query(
      `SELECT id, categorie_source, type_autorisation, numero_autorisation,
              etat_autorisation, date_reelle_autorisation,
              date_reelle_doc, date_reelle_daact,
              comm, dep_code, dep_libelle,
              adr_num_ter, adr_libvoie_ter, adr_lieudit_ter,
              adr_localite_ter, adr_codpost_ter,
              sec_cadastre1, num_cadastre1, sec_cadastre2, num_cadastre2,
              sec_cadastre3, num_cadastre3,
              nb_lgt_tot_crees, i_extension, i_surelevation,
              surf_hab_creee, surf_loc_creee, superficie_terrain,
              source_millesime,
              'commune_section_numero_sans_prefixe' AS precision_correspondance
       FROM public.autorisations_urbanisme
       WHERE comm = $1
         AND ((sec_cadastre1 = ANY($2::text[]) AND num_cadastre1 = ANY($3::text[]))
           OR (sec_cadastre2 = ANY($2::text[]) AND num_cadastre2 = ANY($3::text[]))
           OR (sec_cadastre3 = ANY($2::text[]) AND num_cadastre3 = ANY($3::text[])))
       ORDER BY date_reelle_autorisation DESC NULLS LAST, id DESC`,
      [commune, sections, numeros],
    );
  }
}
