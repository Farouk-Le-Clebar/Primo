import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Copropriete } from '../database/copropriete.entity';
import { EncadrementLoyer } from '../database/encadrement-loyer.entity';
import { LoyerCommune } from '../database/loyer-commune.entity';
import { RplsLogement } from '../database/rpls.entity';
import { CoproprieteService } from './copropriete.service';
import { HabitatController } from './habitat.controller';
import { LoyersService } from './loyers.service';
import { RplsService } from './rpls.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Copropriete,
      RplsLogement,
      LoyerCommune,
      EncadrementLoyer,
    ]),
    JwtModule,
  ],
  controllers: [HabitatController],
  providers: [CoproprieteService, RplsService, LoyersService],
  exports: [CoproprieteService],
})
export class HabitatModule {}
