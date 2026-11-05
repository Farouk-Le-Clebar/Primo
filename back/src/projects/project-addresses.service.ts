import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectAddress } from 'src/database/project-address.entity';
import { CreateProjectAddressDto } from './project-address.dto';

@Injectable()
export class ProjectAddressesService {
  constructor(
    @InjectRepository(ProjectAddress)
    private projectAddressRepository: Repository<ProjectAddress>,
  ) {}

  async getAddressesOfProject(projectId: string): Promise<ProjectAddress[]> {
    return this.projectAddressRepository.find({
      where: { projectId },
      order: { createdAt: 'ASC' },
    });
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
