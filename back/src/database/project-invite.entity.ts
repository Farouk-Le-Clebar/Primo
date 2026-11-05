import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type ProjectInviteStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

@Entity('project_invites')
export class ProjectInvite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    userId: string;

    // Nullable: rows created before the invitation flow was completed have no project reference.
    @Column({ type: 'varchar', nullable: true })
    projectId: string | null;

    @Column({ type: 'varchar', nullable: true })
    memberId: string | null;

    @Column({ type: 'varchar', nullable: false })
    projectName: string;

    @Column({ type: 'varchar', nullable: true })
    inviterName: string | null;

    @Column({ type: 'varchar', nullable: true })
    notificationId: string | null;

    // Cleared once the invitation has been answered or cancelled, so the link cannot be reused.
    @Column({ type: 'varchar', nullable: true })
    verificationToken: string | null;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date | null;

    @Column({ type: 'varchar', default: 'pending' })
    status: ProjectInviteStatus;
}
