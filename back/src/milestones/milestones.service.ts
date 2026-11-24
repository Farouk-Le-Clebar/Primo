import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProjectMilestones } from 'src/database/project-milestones.entity';
import { User } from 'src/database/user.entity';
import { ProjectActivityNotifier } from 'src/notification/project-activity.notifier';
import { CreateMilestoneDto, UpdateMilestoneDto } from './milestone.dto';

export type MilestoneResponse = ProjectMilestones & {
  completedByName: string | null;
};

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(ProjectMilestones)
    private milestonesRepository: Repository<ProjectMilestones>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private activityNotifier: ProjectActivityNotifier,
  ) {}

  async getMilestones(projectId: string): Promise<MilestoneResponse[]> {
    const milestones = await this.milestonesRepository.find({
      where: { projectId },
      order: { position: 'ASC', createdAt: 'ASC' },
    });
    return this.withNames(milestones);
  }

  async createMilestone(
    projectId: string,
    dto: CreateMilestoneDto,
    userId: string,
  ): Promise<MilestoneResponse> {
    const last = await this.milestonesRepository.findOne({
      where: { projectId },
      order: { position: 'DESC' },
    });
    const milestone = await this.milestonesRepository.save(
      this.milestonesRepository.create({
        projectId,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        dueDate: dto.dueDate || null,
        position: (last?.position ?? -1) + 1,
        createdBy: userId,
      }),
    );
    const [response] = await this.withNames([milestone]);
    return response;
  }

  async updateMilestone(
    projectId: string,
    milestoneId: string,
    dto: UpdateMilestoneDto,
    userId: string,
  ): Promise<MilestoneResponse> {
    const milestone = await this.findOrFail(projectId, milestoneId);
    const isNewlyCompleted = dto.isCompleted === true && !milestone.isCompleted;
    if (dto.title !== undefined) milestone.title = dto.title.trim();
    if (dto.description !== undefined)
      milestone.description = dto.description?.trim() || null;
    if (dto.dueDate !== undefined) milestone.dueDate = dto.dueDate || null;
    if (dto.isCompleted !== undefined) {
      milestone.isCompleted = dto.isCompleted;
      milestone.completedAt = dto.isCompleted ? new Date() : null;
      milestone.completedBy = dto.isCompleted ? userId : null;
    }
    const saved = await this.milestonesRepository.save(milestone);
    if (isNewlyCompleted)
      await this.activityNotifier.notify(projectId, userId, 'milestone', {
        milestoneId: saved.id,
        title: saved.title,
      });
    const [response] = await this.withNames([saved]);
    return response;
  }

  async deleteMilestone(projectId: string, milestoneId: string): Promise<void> {
    const milestone = await this.findOrFail(projectId, milestoneId);
    await this.milestonesRepository.delete({ id: milestone.id });
  }

  private async findOrFail(
    projectId: string,
    milestoneId: string,
  ): Promise<ProjectMilestones> {
    const milestone = await this.milestonesRepository.findOneBy({
      id: milestoneId,
      projectId,
    });
    if (!milestone) throw new NotFoundException('Jalon introuvable.');
    return milestone;
  }

  private async withNames(
    milestones: ProjectMilestones[],
  ): Promise<MilestoneResponse[]> {
    const userIds = [
      ...new Set(
        milestones
          .map((milestone) => milestone.completedBy)
          .filter((id): id is string => !!id),
      ),
    ];
    const users = userIds.length
      ? await this.usersRepository.findBy({ id: In(userIds) })
      : [];
    const names = new Map(
      users.map((user) => [
        user.id,
        `${user.firstName} ${user.surName}`.trim(),
      ]),
    );
    return milestones.map((milestone) => ({
      ...milestone,
      completedByName: milestone.completedBy
        ? (names.get(milestone.completedBy) ?? null)
        : null,
    }));
  }
}
