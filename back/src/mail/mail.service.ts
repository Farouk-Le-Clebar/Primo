import axios from 'axios';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

    async generateNewVerificationToken(mail: string): Promise<string> {
        const verificationToken = randomBytes(32).toString('hex');
        const user = await this.userRepo.findOne({ where: { email: mail } });
        if (!user)
            throw new NotFoundException('User not found');

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

    async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
        try {
            const user = await this.userRepo.findOne({ where: { email } });
            if (!user)
                throw new NotFoundException('User not found');

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
                        VERIFY_URL: `${process.env.EMAIL_VERIFICATION_URL}?token=${verificationToken}`,
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

    async verifyEmail(token: string) {
        const verifiedUser = await this.verifiedUserRepo.findOne({ where: { verificationToken: token } });
        if (!verifiedUser)
            throw new NotFoundException('Invalid verification token');

        const user = await this.userRepo.findOne({ where: { id: verifiedUser.userId } });
        if (!user)
            throw new NotFoundException('User not found');
        if (user.verified)
            throw new ConflictException('User is already verified');

        user.verified = true;
        await this.userRepo.save(user);
        try {
            await axios.post(
                process.env.BREVO_API_URL || '',
                {
                    to: [
                        {
                            email: user.email,
                        },
                    ],
                    templateId: 2,
                },
                {
                    headers: {
                        'api-key': process.env.BREVO_API_KEY || '',
                    },
                }
            );
            return { email: user.email };
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new InternalServerErrorException('Failed to send verification email');
        }
    }

    async checkIfVerifiedByEmail(email: string): Promise<boolean> {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user)
            throw new NotFoundException('User not found');

        return await this.isVerified(user);
    }
}
