import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DpeEntity } from '../database/dpe.entity';

@Injectable()
export class DpeService {
  constructor(
    @InjectRepository(DpeEntity)
    private readonly dpeRepository: Repository<DpeEntity>,
  ) {}

  async getDpeByBan(identifiantBan: string) {
    const dpes = await this.dpeRepository.find({
      where: { identifiant_ban: identifiantBan },
    });

    if (!dpes || dpes.length === 0) {
      throw new NotFoundException(`Aucun DPE trouvé pour l'identifiant BAN}`);
    }

    return dpes;
  }
}