import axios from 'axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { User } from 'src/database/user.entity';
import { VerifiedUser } from 'src/database/verified-users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MailService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(VerifiedUser)
        private verifiedUserRepo: Repository<VerifiedUser>,
    ) { }

    async isVerified(user: User): Promise<boolean> {
        const verifiedUser = await this.verifiedUserRepo.findOne({ where: { userId: user.id } });
        if (!verifiedUser)
            return false;
        return user.verified;
    }

    async generateNewVerificationToken(user: User): Promise<string> {
        const verificationToken = randomBytes(32).toString('hex');

        const existingToken = await this.verifiedUserRepo.findOne({ where: { userId: user.id } });

        if (existingToken) {
            await this.verifiedUserRepo.update({ userId: user.id }, {
                verificationToken,
                emailSent: false,
                lastEmailDate: new Date(),
            });
        } else {
            await this.verifiedUserRepo.insert({
                userId: user.id,
                verificationToken,
                emailSent: false,
                lastEmailDate: new Date(),
            });
        }

        return verificationToken;
    }

    async sendVerificationEmail(user: User, verificationToken: string): Promise<void> {
        try {
            await axios.post(
                process.env.BREVO_API_URL || '',
                {
                    to: [
                        {
                            email: user.email,
                        },
                    ],
                    templateId: 3,
                    params: {
                        VERIFY_URL: 'https://app.primo-data.fr/verify?token=' + verificationToken,
                    },
                },
                {
                    headers: {
                        'api-key': process.env.BREVO_API_KEY || '',
                    },
                }
            );

            await this.verifiedUserRepo.update(
                { userId: user.id },
                { emailSent: true, lastEmailDate: new Date() }
            );
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new InternalServerErrorException('Failed to send verification email');
        }
    }
}
