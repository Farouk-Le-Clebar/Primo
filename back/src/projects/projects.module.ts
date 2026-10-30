import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Projects } from 'src/database/project.entity';
import { ProjectPlots } from 'src/database/project-plots.entity';
import { ProjectMembers } from 'src/database/project-members.entity';
import { User } from 'src/database/user.entity';
import { ProjectInvite } from 'src/database/project-invite.entity';
import { MailModule } from 'src/mail/mail.module';
import { ProjectDocuments } from 'src/database/project-documents.entity';
import { StorageModule } from 'src/storage/storage.module';
import { DvfModule } from 'src/dvf/dvf.module';
import { DpeModule } from 'src/dpe/dpe.module';
import { AutorisationsModule } from 'src/autorisations/autorisations.module';
import { ProximiteModule } from 'src/proximite/proximite.module';
import { ProjectPlotComparison } from 'src/database/project-plot-comparison.entity';
import { PlotEnrichmentService } from './plot-enrichment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Projects, ProjectPlots, ProjectMembers, ProjectInvite, ProjectDocuments, ProjectPlotComparison, User]), JwtModule, MailModule, StorageModule, DvfModule, DpeModule, AutorisationsModule, ProximiteModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, PlotEnrichmentService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
