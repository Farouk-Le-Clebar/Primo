import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './database/user.entity';
import { AddokProxyMiddleware } from './api/addok.middleware';
import { ApicartoProxyMiddleware } from './api/apicarto.middleware';
import { GraphhopperProxyMiddleware } from './api/graphhopper.middleware';
import { AuthModule } from './auth/auth.module';
import { GeoServerProxyMiddleware } from './api/geoserver.middleware';
import { GeoModule } from './geo/geo.module';
import { UserModule } from './user/user.module';

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
        : 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    GeoModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddokProxyMiddleware).forRoutes('/addok');
    consumer.apply(ApicartoProxyMiddleware).forRoutes('/apicarto');
    consumer.apply(GraphhopperProxyMiddleware).forRoutes('/gh');
    consumer.apply(GeoServerProxyMiddleware).forRoutes('/geoserver');
  }
}
