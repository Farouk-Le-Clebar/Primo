import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './database/user.entity';
import { Projects } from './database/project.entity';
import { Notification } from './database/notification.entity';
import { DvfMutation } from './database/dvf.entity';
import { DpeEntity } from './database/dpe.entity';
import { AddokProxyMiddleware } from './api/addok.middleware';
import { AuthModule } from './auth/auth.module';
import { GeoServerProxyMiddleware } from './api/geoserver.middleware';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { FeedbackModule } from './feedback/feedback.module';
import { DvfModule } from './dvf/dvf.module';
import { DpeModule } from './dpe/dpe.module';
import { VerifiedUser } from './database/verified-users.entity';
import { MailModule } from './mail/mail.module';
import { UserStatistics } from './database/user-statistics.entity';
import { ResetPassword } from './database/reset-password.entity';
import { SearchHistory } from './database/search-history.entity';
import { Feedback } from './database/feedback.entity';
import { ProjectPlots } from './database/project-plots.entity';
import { ProjectsModule } from './projects/projects.module';
import { ProjectMembers } from './database/project-members.entity';
import { AiModule } from './ai/ai.module';
import { ProjectDocuments } from './database/project-documents.entity';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { ProjectInvite } from './database/project-invite.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT
        ? parseInt(process.env.POSTGRES_PORT, 10)
        : 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User, SearchHistory, Projects, DvfMutation, DpeEntity, Notification, VerifiedUser, ResetPassword, UserStatistics, Feedback, ProjectPlots, ProjectMembers, ProjectDocuments, ProjectInvite],
      synchronize: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([User, SearchHistory, Projects, DvfMutation, DpeEntity, Notification, VerifiedUser, ResetPassword, UserStatistics, Feedback, ProjectPlots, ProjectMembers, ProjectDocuments, ProjectInvite]),
    AuthModule,
    UserModule,
    DvfModule,
    DpeModule,
    NotificationModule,
    FeedbackModule,
    MailModule,
    ProjectsModule,
    AiModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddokProxyMiddleware).forRoutes('/addok');
    consumer.apply(GeoServerProxyMiddleware).forRoutes('/geoserver');
  }
}