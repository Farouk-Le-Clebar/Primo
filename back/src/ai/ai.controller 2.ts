import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import type { Response } from 'express';
import type { AskDTO } from './ai.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('ask')
    async generate(
        @Body() { prompt }: AskDTO,
        @Res() res: Response
    ) {
        console.log('Received prompt:', prompt);
        await this.aiService.streamText(prompt, res);
    }
}