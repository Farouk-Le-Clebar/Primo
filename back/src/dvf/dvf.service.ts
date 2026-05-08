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
    const ventes = await this.dvfRepository.find({
      where: { id_parcelle: idParcelle },
      order: { date_mutation: 'DESC' },
    });

    if (!ventes || ventes.length === 0) {
      throw new NotFoundException(`Aucune transaction trouvée pour la parcelle ${idParcelle}`);
    }

    return ventes;
  }
}