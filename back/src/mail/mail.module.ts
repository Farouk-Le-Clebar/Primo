import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { VerifiedUser } from 'src/database/verified-users.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, VerifiedUser]), JwtModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})

export class MailModule {}
