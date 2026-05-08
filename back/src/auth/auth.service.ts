import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { NotificationType } from '../database/notification.entity';
import { NotificationService } from '../notification/notification.service';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'CLIENT_ID');
  }

  async register(email: string, firstName: string, surName: string, password: string) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new UnauthorizedException('Email déjà utilisé');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      firstName,
      surName,
      email,
      password: hashedPassword,
      provider: 'local',
    });

    await this.userRepository.save(user);

    // Notification de bienvenue !!! à changer une fois qu'on a panel admin -> on enverra des notifications depuis ce panel.
    await this.notificationService.createNotification(
      user.id,
      NotificationType.SYSTEM,
      'Bienvenue sur Primo ! 🎉',
      'Nous sommes ravis de vous accueillir. Commencez par créer votre premier projet pour explorer toutes les fonctionnalités.',
      { welcomeNotification: true },
    );

    const verificationToken = await this.mailService.generateNewVerificationToken(email);
    await this.mailService.sendVerificationEmail(email, verificationToken);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'firstName', 'surName', 'profilePicture', 'password', 'mapPreference', 'isAdmin', 'provider', 'verified'],
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    if (!user.password) {
      if (user.provider === 'google') {
        throw new UnauthorizedException('Ce compte a été créé avec Google. Veuillez utiliser le bouton Google pour vous connecter.');
      }
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    if (!user.verified) {
      throw new UnauthorizedException('Veuillez vérifier votre adresse e-mail avant de vous connecter.');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        surName: user.surName,
        profilePicture: user.profilePicture,
        mapPreference: user.mapPreference,
        isAdmin: user.isAdmin,
      },
    };
  }

  async googleLogin(googleToken: string) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${googleToken}` },
      });
      const payload = await response.json();

      if (!payload || !payload.email) {
        throw new BadRequestException('Token Google invalide ou e-mail manquant');
      }

      const { email, given_name, family_name, picture } = payload;

      let user = await this.userRepository.findOne({ where: { email } });
      let isNewUser = false;

      if (!user) {
        user = this.userRepository.create({
          email,
          firstName: given_name || 'Utilisateur',
          surName: family_name || '',
          profilePicture: picture || '',
          provider: 'google',
          verified: true,
        });
        await this.userRepository.save(user);
        isNewUser = true;
      }

      const jwtPayload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(jwtPayload);

      return {
        access_token: token,
        isNewUser,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          surName: user.surName,
          profilePicture: user.profilePicture,
          mapPreference: user.mapPreference,
          isAdmin: user.isAdmin,
        },
      };
    } catch (error) {
      console.error('Erreur Google Auth:', error);
      throw new UnauthorizedException('Échec de la connexion Google');
    }
  }

  async validateUser(payload: { sub: string; email: string }) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'email', 'firstName', 'surName', 'profilePicture', 'mapPreference', 'isAdmin', 'verified'],
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      surName: user.surName,
      profilePicture: user.profilePicture,
      mapPreference: user.mapPreference,
      isAdmin: user.isAdmin,
      verified: user.verified,
    };
  }

  async updateLastConnection(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return;
    user.lastConnection = new Date();
    await this.userRepository.save(user);
  }
}