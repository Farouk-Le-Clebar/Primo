import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { UpdateProfileDto } from './dto/update-profile';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    const user = await this.userRepo.findOne({ where: { email } });
    return { exists: !!user };
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, id, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(ReqId: string, updateData: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: ReqId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateData.firstName !== undefined)
      user.firstName = updateData.firstName;
    if (updateData.surName !== undefined)
      user.surName = updateData.surName;
    if (updateData.profilePicture !== undefined)
      user.profilePicture = updateData.profilePicture;

    const updatedUser = await this.userRepo.save(user);

    const { password, id, ...safeUser } = updatedUser;
    return {
      message: 'Profile updated successfully',
      user: safeUser,
    };
  }

  async updateMapPreference(id: string, mapPreference: string) {
    const user = await this.userRepo.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.mapPreference = mapPreference;

    const updatedUser = await this.userRepo.save(user);
    if (!updatedUser) {
      throw new NotFoundException('Failed to update map preference');
    }

    return {
      message: 'Preference changed successfully',
    };
  }
}