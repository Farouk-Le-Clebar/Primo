import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { User } from 'src/database/user.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send/verification')
    async sendVerification(@Body() body: any) {
        const email = body.email;
        if (!email)
            throw new BadRequestException('Email is required');
        if (await this.mailService.checkIfVerifiedByEmail(email))
            throw new BadRequestException('Email is already verified');
        else {
            const verificationToken = await this.mailService.generateNewVerificationToken(email);
            await this.mailService.sendVerificationEmail(email, verificationToken);
        }
    }

    @Post('verify')
    async verifyEmail(@Body('token') verificationToken: string) {
        if (!verificationToken)
            throw new BadRequestException('Token is required');
        else
            return await this.mailService.verifyEmail(verificationToken);
    }
}
