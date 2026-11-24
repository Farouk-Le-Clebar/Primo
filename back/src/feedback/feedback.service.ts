import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../database/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { User } from '../database/user.entity';
import { UserNotifier } from '../notification/user-notifier';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepo: Repository<Feedback>,
    private userNotifier: UserNotifier,
  ) { }

  async create(dto: CreateFeedbackDto, user: User) {
    const feedback = this.feedbackRepo.create({
      ...dto,
      user: user,
    });
    const saved = await this.feedbackRepo.save(feedback);
    await this.userNotifier.feedbackReceived(saved.title, `${user.firstName} ${user.surName}`.trim());
    return saved;
  }

  async findAll() {
    return await this.feedbackRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        user: {
          firstName: true,
          surName: true,
          email: true,
        }
      }
    });
  }

  async deleteFeedback(id: string) {
    const feedback = await this.feedbackRepo.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException('Feedback introuvable');
    }

    await this.feedbackRepo.remove(feedback);
    return { message: 'Feedback supprimé avec succès' };
  }
}