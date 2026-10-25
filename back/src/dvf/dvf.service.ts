import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DvfMutation } from '../database/dvf.entity';

export interface DvfHistorique {
  historique: DvfMutation[];
  lignes_mutations: DvfMutation[];
}

const COMMUNE_CODE_LENGTH = 5;

@Injectable()
export class DvfService {
  constructor(
    @InjectRepository(DvfMutation)
    private readonly dvfRepository: Repository<DvfMutation>,
  ) {}

  async getHistoriqueByParcelle(idParcelle: string): Promise<DvfHistorique> {
    const ventes = await this.dvfRepository.find({
      where: { id_parcelle: idParcelle },
      order: { date_mutation: 'DESC' },
    });

    if (!ventes || ventes.length === 0) {
      throw new NotFoundException(
        `Aucune transaction trouvée pour la parcelle ${idParcelle}`,
      );
    }

    return {
      historique: ventes,
      lignes_mutations: await this.findMutationLines(
        idParcelle.slice(0, COMMUNE_CODE_LENGTH),
        ventes,
      ),
    };
  }

  private async findMutationLines(
    commune: string,
    ventes: DvfMutation[],
  ): Promise<DvfMutation[]> {
    const mutationIds = [
      ...new Set(ventes.map((v) => v.id_mutation).filter(Boolean)),
    ];
    if (mutationIds.length > 0) {
      const lignes = await this.dvfRepository.find({
        where: { id_mutation: In(mutationIds) },
      });
      const orphelines = ventes.filter((v) => !v.id_mutation);
      return orphelines.length
        ? [...lignes, ...(await this.findLegacyLines(commune, orphelines))]
        : lignes;
    }
    return this.findLegacyLines(commune, ventes);
  }

  private async findLegacyLines(
    commune: string,
    ventes: DvfMutation[],
  ): Promise<DvfMutation[]> {
    const dates = [
      ...new Set(ventes.map((v) => v.date_mutation).filter(Boolean)),
    ];
    const valeurs = [
      ...new Set(ventes.map((v) => v.valeur_fonciere).filter((v) => v != null)),
    ];
    if (!dates.length || !valeurs.length) return ventes;

    return this.dvfRepository
      .createQueryBuilder('dvf')
      .where('dvf.id_parcelle LIKE :commune', { commune: `${commune}%` })
      .andWhere('dvf.id_mutation IS NULL')
      .andWhere('dvf.date_mutation IN (:...dates)', { dates })
      .andWhere('dvf.valeur_fonciere IN (:...valeurs)', { valeurs })
      .getMany();
  }
}
