import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';

@Module({
    controllers: [AiController],
    providers: [AiService],
    imports: [JwtModule],
})
export class AiModule { }