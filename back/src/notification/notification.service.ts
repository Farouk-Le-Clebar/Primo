import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
} from '../database/notification.entity';
import { User } from '../database/user.entity';
import { NotificationResponseDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<NotificationResponseDto> {
    try {
      const notification = this.notificationRepository.create({
        userId,
        type,
        title,
        message,
        metadata: metadata ?? null,
      });

      const saved = await this.notificationRepository.save(notification);
      return this.toResponseDto(saved);
    } catch (error) {
      throw new BadRequestException(
        'Erreur lors de la création de la notification',
      );
    }
  }

  async getUserNotifications(
    userId: string,
  ): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return notifications.map((n) => this.toResponseDto(n));
  }

  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification avec l'ID ${notificationId} non trouvée`,
      );
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à cette notification');
    }

    notification.isRead = true;
    const updated = await this.notificationRepository.save(notification);
    return this.toResponseDto(updated);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification avec l'ID ${notificationId} non trouvée`,
      );
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé à cette notification');
    }

    await this.notificationRepository.remove(notification);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async sendWelcomeToExistingUsers(): Promise<{
    sent: number;
    skipped: number;
  }> {
    const alreadyNotified = await this.notificationRepository
      .createQueryBuilder('n')
      .select('n.userId')
      .where('n.type = :type', { type: NotificationType.SYSTEM })
      .andWhere('JSON_EXTRACT(n.metadata, "$.welcomeNotification") = true')
      .getRawMany();

    const notifiedIds = new Set(alreadyNotified.map((r) => r.n_userId));

    const allUsers = await this.userRepository.find({ select: ['id'] });
    const usersToNotify = allUsers.filter((u) => !notifiedIds.has(u.id));

    if (usersToNotify.length > 0) {
      const notifications = usersToNotify.map((user) =>
        this.notificationRepository.create({
          userId: user.id,
          type: NotificationType.SYSTEM,
          title: 'Bienvenue sur Primo !',
          message:
            'Nous sommes ravis de vous accueillir. Commencez par créer votre premier projet pour explorer toutes les fonctionnalités.',
          metadata: { welcomeNotification: true },
        }),
      );
      await this.notificationRepository.save(notifications);
    }

    return { sent: usersToNotify.length, skipped: notifiedIds.size };
  }

  private toResponseDto(notification: Notification): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      metadata: notification.metadata,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  }
}
