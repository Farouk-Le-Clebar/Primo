import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('project_invites')
export class ProjectInvite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    userId: string;

    @Column({ type: 'varchar', nullable: false })
    projectName: string;

    @Column({ type: 'varchar', nullable: true })
    verificationToken: string | null;
}
