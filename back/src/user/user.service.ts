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

  async userIsAdmin(userId: string): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['isAdmin'],
    });
    return user?.isAdmin || false;
  }

  async getUsers(from: number, to: number) {
    const users = await this.userRepo.find({
      skip: from,
      take: to - from,
    });

    return users.map(({ password, mapPreference, ...safeUser }) => safeUser);
  }

  async deleteUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.remove(user);

    return { message: 'User deleted successfully' };
  }

  async searchUsers(query: string) {
    const lowerQuery = query.toLowerCase();

    const users = await this.userRepo
      .createQueryBuilder('user')
      .where('LOWER(user.firstName) LIKE :query', { query: `%${lowerQuery}%` })
      .orWhere('LOWER(user.surName) LIKE :query', { query: `%${lowerQuery}%` })
      .orWhere('LOWER(user.email) LIKE :query', { query: `%${lowerQuery}%` })
      .orWhere("LOWER(CONCAT(user.firstName, ' ', user.surName)) LIKE :query", { query: `%${lowerQuery}%` })
      .getMany();

    return users.map(({ password, mapPreference, ...safeUser }) => safeUser);
  }

  async getAdmins() {
    const admins = await this.userRepo.find({ where: { isAdmin: true } });
    return admins.map(({ password, mapPreference, ...safeUser }) => safeUser);
  }

  async removeAdminPermissionToUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isAdmin = false;

    const updatedUser = await this.userRepo.save(user);
    if (!updatedUser) {
      throw new NotFoundException('Failed to update user permissions');
    }
  }

  async addAdminPermissionToUser(email: string) {
    const user = await this.userRepo.findOne({ where: { email: email } });

    if (!user)
      throw new NotFoundException('User not found');

    if (user.isAdmin)
      throw new NotFoundException('User is already an admin');

    user.isAdmin = true;

    const updatedUser = await this.userRepo.save(user);
    if (!updatedUser)
      throw new NotFoundException('Failed to update user permissions');
  }
}
