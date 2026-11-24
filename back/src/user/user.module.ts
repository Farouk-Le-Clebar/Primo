import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';
import { ResetPassword } from 'src/database/reset-password.entity';
import { SearchHistory } from '../database/search-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ResetPassword, SearchHistory]), JwtModule, NotificationModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}