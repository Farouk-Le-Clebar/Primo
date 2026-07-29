import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { UserStatistics } from '../database/user-statistics.entity';
import { UAParser } from 'ua-parser-js';
import * as geoip from 'geoip-lite';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(UserStatistics)
    private readonly statsRepo: Repository<UserStatistics>,
  ) {}

  async logConnection(userId: string, req: any) {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentLog = await this.statsRepo.findOne({
        where: { userId: userId, connectedAt: MoreThan(oneHourAgo) },
      });

      if (recentLog) {
        return { message: 'ALREADY LOGGED' };
      }

      const userAgentStr = req.headers['user-agent'] || '';
      const parser = new UAParser(userAgentStr);
      const result = parser.getResult();

      const ipAddress = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString().split(',')[0].trim();
      const geo = geoip.lookup(ipAddress);
      
      const acceptLanguage = req.headers['accept-language'] || '';
      const mainLanguage = acceptLanguage.split(',')[0].trim();

      const stat = new UserStatistics();
      stat.userId = userId;
      stat.ipAddress = ipAddress;
      stat.browser = `${result.browser.name || 'Inconnu'} ${result.browser.version || ''}`.trim();
      stat.os = `${result.os.name || 'Inconnu'} ${result.os.version || ''}`.trim();
      stat.deviceType = result.device.type || 'desktop';
      stat.country = geo?.country || '';
      stat.city = geo?.city || '';
      stat.language = mainLanguage || '';

      await this.statsRepo.save(stat);
      
      return { message: 'SUCCESS' };
    } catch (error) {
      console.error('Erreur Log Statistics:', error);
      return { message: 'ERROR' };
    }
  }

  async getAllStats() {
    return await this.statsRepo.find({
      relations: ['user'],
      order: { connectedAt: 'DESC' },
    });
  }

  async getStatsByUser(userId: string) {
    return await this.statsRepo.find({
      where: { userId },
      relations: ['user'],
      order: { connectedAt: 'DESC' },
    });
  }

  async getMostUsedOS() {
    const result = await this.statsRepo
      .createQueryBuilder('stats')
      .select('stats.os', 'os')
      .addSelect('COUNT(stats.os)', 'count')
      .groupBy('stats.os')
      .orderBy('count', 'DESC')
      .limit(1)
      .getRawOne();

    return result || { os: 'Inconnu', count: 0 };
  }
}