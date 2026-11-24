import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/database/user.entity';
import { ProjectAddress } from 'src/database/project-address.entity';
import { CreateProjectAddressDto } from './project-address.dto';

@Injectable()
export class ProjectAddressesService {
  constructor(
    @InjectRepository(ProjectAddress)
    private projectAddressRepository: Repository<ProjectAddress>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAddressesOfProject(projectId: string): Promise<(ProjectAddress & { createdByName: string | null })[]> {
    const addresses = await this.projectAddressRepository.find({
      where: { projectId },
      order: { createdAt: 'ASC' },
    });
    const authorIds = [...new Set(addresses.map((address) => address.createdBy).filter((id): id is string => !!id))];
    const authors = authorIds.length ? await this.usersRepository.findBy({ id: In(authorIds) }) : [];
    const names = new Map(authors.map((author) => [author.id, `${author.firstName} ${author.surName}`.trim()]));
    return addresses.map((address) => ({ ...address, createdByName: address.createdBy ? names.get(address.createdBy) ?? null : null }));
  }

  async addAddressToProject(
    projectId: string,
    dto: CreateProjectAddressDto,
    userId: string,
  ): Promise<ProjectAddress> {
    const address = this.projectAddressRepository.create({
      projectId,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      description: dto.description?.trim() || null,
      name: dto.name?.trim() || null,
      category: dto.category ?? null,
      createdBy: userId,
    });
    return this.projectAddressRepository.save(address);
  }

  async deleteAddressFromProject(
    projectId: string,
    addressId: string,
  ): Promise<void> {
    const result = await this.projectAddressRepository.delete({
      id: addressId,
      projectId,
    });
    if (!result.affected) throw new NotFoundException('Adresse introuvable.');
  }

  async deleteAddressesOfProject(projectId: string): Promise<void> {
    await this.projectAddressRepository.delete({ projectId });
  }
}
