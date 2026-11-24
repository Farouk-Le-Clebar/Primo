import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPlotComparison } from 'src/database/project-plot-comparison.entity';
import { ProjectNotes } from 'src/database/project-notes.entity';
import { ProjectPlots } from 'src/database/project-plots.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ComparisonsController } from './comparisons.controller';
import { ComparisonsService } from './comparisons.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectPlotComparison, ProjectPlots, ProjectNotes]), JwtModule, ProjectsModule, NotificationModule],
  controllers: [ComparisonsController],
  providers: [ComparisonsService],
})
export class ComparisonsModule {}
