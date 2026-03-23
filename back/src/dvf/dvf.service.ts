import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DvfMutation } from '../database/dvf.entity';

@Injectable()
export class DvfService {
  constructor(
    @InjectRepository(DvfMutation)
    private readonly dvfRepository: Repository<DvfMutation>,
  ) {}

  async getHistoriqueByParcelle(idParcelle: string) {
    // Utilisation du QueryBuilder de TypeORM optimisé pour MySQL
    const ventes = await this.dvfRepository
      .createQueryBuilder('dvf')
      .select([
        'dvf.dateMutation AS date',
        'dvf.natureMutation AS nature',
        'dvf.valeurFonciere AS prix',
        'dvf.surfaceReelleBati AS surface',
        'dvf.typeLocal AS typeLocal',
        // Calcul du prix au m² géré par MySQL (ROUND et division)
        'ROUND((dvf.valeurFonciere / dvf.surfaceReelleBati), 2) AS prixM2',
      ])
      .where('dvf.idParcelle = :idParcelle', { idParcelle })
      .andWhere('dvf.valeurFonciere IS NOT NULL')
      .andWhere('dvf.surfaceReelleBati > 0')
      .orderBy('dvf.dateMutation', 'DESC')
      .getRawMany(); // getRawMany permet de récupérer les calculs (prixM2) proprement

    if (!ventes || ventes.length === 0) {
      throw new NotFoundException(`Aucune transaction trouvée pour la parcelle ${idParcelle}`);
    }

    let sumPrixM2 = 0;
    let countValides = 0;

    const formattedVentes = ventes.map((v) => {
      const prixM2 = parseFloat(v.prixM2);
      if (prixM2 && !isNaN(prixM2)) {
        sumPrixM2 += prixM2;
        countValides++;
      }

      return {
        date: v.date,
        nature: v.nature,
        prix: parseFloat(v.prix),
        surface: v.surface,
        typeLocal: v.typeLocal,
        prixM2: prixM2 || null,
      };
    });

    return {
      parcelle: idParcelle,
      stats: {
        prixMoyenM2: countValides > 0 ? Math.round(sumPrixM2 / countValides) : null,
        nombreTransactions: ventes.length,
        derniereVente: formattedVentes[0].date,
      },
      historique: formattedVentes,
    };
  }
}