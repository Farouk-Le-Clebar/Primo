import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { NotificationType } from '../database/notification.entity';
import { NotificationService } from '../notification/notification.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  async register(
    email: string,
    firstName: string,
    surName: string,
    password: string,
  ) {
    console.log('Registering user:', email, firstName, surName);

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Email déjà utilisé');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      firstName,
      surName,
      email,
      password: hashedPassword,
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

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    const { password: _, ...result } = user;

    return {
      access_token: token,
      user: {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        surName: result.surName,
        profilePicture: result.profilePicture,
        mapPreference: result.mapPreference,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'firstName',
        'surName',
        'profilePicture',
        'password',
        'mapPreference',
        'isAdmin',
      ],
    });
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
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

  async validateUser(payload: { sub: string; email: string }) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'email', 'firstName', 'surName', 'profilePicture', 'mapPreference', "isAdmin"],
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      surName: user.surName,
      profilePicture: user.profilePicture,
      mapPreference: user.mapPreference,
      isAdmin: user.isAdmin,
    };
  }
}
