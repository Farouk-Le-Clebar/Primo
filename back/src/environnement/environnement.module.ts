import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AntennesService } from './antennes.service';
import { EnvironnementController } from './environnement.controller';
import { EnvironnementService } from './environnement.service';
import { FibreService } from './fibre.service';
import { QualiteAirService } from './qualite-air.service';
import { SolsPolluesService } from './sols-pollues.service';

@Module({
  imports: [JwtModule],
  controllers: [EnvironnementController],
  providers: [
    EnvironnementService,
    SolsPolluesService,
    QualiteAirService,
    AntennesService,
    FibreService,
  ],
})
export class EnvironnementModule {}
