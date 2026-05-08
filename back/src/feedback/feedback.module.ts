import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { Feedback } from '../database/feedback.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback]),
    JwtModule,
    UserModule
    ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}