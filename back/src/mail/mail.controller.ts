import { BadRequestException, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { User } from 'src/database/user.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send/verification')
    @UseGuards(JwtAuthGuard)
    async sendVerificationEmail(@Req() req: any) {
        const user = req.user as User;
        if (user.verified)
            throw new BadRequestException('User is already verified');
        else {
            const verificationToken = await this.mailService.generateNewVerificationToken(user);
            await this.mailService.sendVerificationEmail(user, verificationToken);
        }
    }
}
