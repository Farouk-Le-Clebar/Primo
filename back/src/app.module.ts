import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './database/user.entity';
import { Projects } from './database/project.entity';
import { Notification } from './database/notification.entity';
import { DvfMutation } from './database/dvf.entity';
import { DpeEntity } from './database/dpe.entity';
import { AddokProxyMiddleware } from './api/addok.middleware';
import { AuthModule } from './auth/auth.module';
import { GeoServerProxyMiddleware } from './api/geoserver.middleware';
import { OllamaProxyMiddleware } from './api/ollama.middleware';
import { GeoModule } from './geo/geo.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT
        ? parseInt(process.env.MYSQL_PORT, 10)
        : 6673,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [User, SearchHistory, Projects, DvfMutation, DpeEntity, Notification, VerifiedUser, ResetPassword, UserStatistics, Feedback, ProjectPlots, ProjectMembers],
      synchronize: true,
      timezone: 'Z',
    }),
    TypeOrmModule.forFeature([User, SearchHistory, Projects, DvfMutation, DpeEntity, Notification, VerifiedUser, ResetPassword, UserStatistics, Feedback, ProjectPlots, ProjectMembers]),
    AuthModule,
    GeoModule,
    UserModule,
    DvfModule,
    DpeModule,
    NotificationModule,
    FeedbackModule,
    MailModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddokProxyMiddleware).forRoutes('/addok');
    consumer.apply(GeoServerProxyMiddleware).forRoutes('/geoserver');
    consumer.apply(OllamaProxyMiddleware).forRoutes('/ai/ask');
  }
}