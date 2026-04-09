import { BadRequestException, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { User } from 'src/database/user.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('mail')
export class MailController {
    @Post('send/verification')
    @UseGuards(JwtAuthGuard)
    async sendVerificationEmail(@Req() req: User) {
        const user = req;
        if (user.verified)
            throw new BadRequestException('User is already verified');
        else {
            const verificationToken = randomBytes(32).toString('hex');
            return verificationToken;
        }
    }
}
