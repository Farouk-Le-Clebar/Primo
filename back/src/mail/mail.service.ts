import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { VerifiedUser } from 'src/database/verified-users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MailService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(VerifiedUser)
        private verifiedUserRepo: Repository<VerifiedUser>,
    ) { }

}
