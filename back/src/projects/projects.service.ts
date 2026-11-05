import { BadRequestException, ConflictException, ForbiddenException, GoneException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';
import { Projects } from 'src/database/project.entity';
import { AddPlotToProjectDto, CreateProjectDto, InviteUserDto, RequestDocumentUploadDto } from './project.type';
import { ProjectPlots } from 'src/database/project-plots.entity';
import { ProjectMembers } from 'src/database/project-members.entity';
import { User } from 'src/database/user.entity';
import { randomBytes, randomUUID } from 'crypto';
import { ProjectInvite } from 'src/database/project-invite.entity';
import { NotificationType } from 'src/database/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { MailService } from 'src/mail/mail.service';
import { ProjectDocuments } from 'src/database/project-documents.entity';
import { StorageService } from 'src/storage/storage.service';
import { ProjectPlotComparison } from 'src/database/project-plot-comparison.entity';
import { PlotEnrichmentService } from './plot-enrichment.service';
import { buildPlotSummary } from './plot-summary';

// Invitation links stay valid for 48 hours.
const INVITATION_VALIDITY_MS = 48 * 60 * 60 * 1000;
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;
const USER_STORAGE_QUOTA = 1024 * 1024 * 1024;
// Presigned upload URLs expire after 5 minutes, so older pending uploads can no longer complete.
const PENDING_UPLOAD_WINDOW_MS = 10 * 60 * 1000;

const ALLOWED_DOCUMENT_TYPES: Record<string, { documentType: string; extensions: string[] }> = {
    'application/pdf': { documentType: 'pdf', extensions: ['pdf'] },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { documentType: 'document', extensions: ['docx'] },
    'image/png': { documentType: 'image', extensions: ['png'] },
    'image/jpeg': { documentType: 'image', extensions: ['jpg', 'jpeg'] },
};

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Projects)
        private projectsRepository: Repository<Projects>,
        @InjectRepository(ProjectPlots)
        private projectPlotsRepository: Repository<ProjectPlots>,
        @InjectRepository(ProjectMembers)
        private projectMembersRepository: Repository<ProjectMembers>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(ProjectInvite)
        private projectInviteRepository: Repository<ProjectInvite>,
        @InjectRepository(ProjectDocuments)
        private projectDocumentsRepository: Repository<ProjectDocuments>,
        @InjectRepository(ProjectPlotComparison)
        private comparisonsRepository: Repository<ProjectPlotComparison>,

        private mailService: MailService,
        private notificationService: NotificationService,
        private storageService: StorageService,
        private plotEnrichmentService: PlotEnrichmentService,
    ) { }

    async userIsMemberOfProject(userId: string, projectId: string): Promise<boolean> {
        // A pending invitation does not grant any access to the project.
        const member = await this.projectMembersRepository.findOneBy({
            userId: userId,
            projectId: projectId,
            isPending: false,
        });

        return !!member;
    }

    async createProject(createProjectDto: CreateProjectDto, userId: string) {
        let project = this.projectsRepository.create({
            name: createProjectDto.name,
            description: createProjectDto.description,
        });

        project = await this.projectsRepository.save(project);

        const member = await this.projectMembersRepository.create({
            userId: userId,
            projectId: project.id,
            isAdmin: true,
            role: 'admin',
            isPending: false,
            joinedAt: new Date(),
        });

        await this.projectMembersRepository.save(member);
    }

    async getProjects(userId: string) {
        const projectMembers = await this.projectMembersRepository.find({
            where: { userId: userId, isPending: false },
            order: { isFavorite: "DESC" },
        });

        if (projectMembers.length === 0)
            return [];

        const projectIds = projectMembers.map(member => member.projectId);

        const projects = await this.projectsRepository.find({
            where: { id: In(projectIds) },
        });

        const projectsMap = new Map(projects.map(p => [p.id, p]));

        const sortedProjects: any[] = [];
        for (const member of projectMembers) {
            const project = projectsMap.get(member.projectId);
            if (project) {
                project['isFavorite'] = member.isFavorite;
                sortedProjects.push(project);
            }
        }

        return sortedProjects;
    }

    async getProjectById(projectId: string, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: projectId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        const isMember = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
            isPending: false,
        });

        if (!isMember)
            throw new UnauthorizedException('Project not found or does not belong to the user');

        return project;
    }

    async deleteProject(projectId: string, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: projectId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        const isAdmin = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
            isAdmin: true,
        });

        if (!isAdmin)
            throw new UnauthorizedException('Project not found or does not belong to the user');

        const documents = await this.projectDocumentsRepository.findBy({ projectId: projectId });
        await Promise.all(documents.map(document => this.deleteStoredObject(document.storageKey)));

        await this.projectsRepository.delete({ id: projectId });
        await this.projectMembersRepository.delete({ projectId: projectId });
        await this.projectPlotsRepository.delete({ projectId: projectId });
        await this.projectDocumentsRepository.delete({ projectId: projectId });
        await this.comparisonsRepository.delete({ projectId: projectId });
    }


    async addPlotToProject(addPlotToProjectDto: AddPlotToProjectDto, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: addPlotToProjectDto.projectId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        const isMember = await this.projectMembersRepository.findOneBy({
            projectId: addPlotToProjectDto.projectId,
            userId: userId,
            isPending: false,
        });

        if (!isMember)
            throw new UnauthorizedException('Project does not belong to the user');

        const projectPlot = this.projectPlotsRepository.create({
            projectId: addPlotToProjectDto.projectId,
            plotId: addPlotToProjectDto.plotId,
            plotBanId: addPlotToProjectDto.plotBanId,
            coordinates: addPlotToProjectDto.coordinates,
            adress: addPlotToProjectDto.adress,
            geometry: addPlotToProjectDto.geometry,
            ...await this.plotEnrichmentService.enrich({
                plotId: addPlotToProjectDto.plotId,
                plotBanId: addPlotToProjectDto.plotBanId,
                geometry: this.plotEnrichmentService.parseGeometry(addPlotToProjectDto.geometry),
                parcelProperties: addPlotToProjectDto.parcelProperties,
                addressProperties: addPlotToProjectDto.addressProperties,
            }),
        });

        const response = await this.projectPlotsRepository.save(projectPlot);

        if (response) {
            project.numberOfPlots += 1;
            await this.projectsRepository.save(project);
        }
    }

    async toggleFavorite(projectId: string, userId: string) {
        const project = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
            isPending: false,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        const isMember = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
            isPending: false,
        });

        if (!isMember)
            throw new UnauthorizedException('Project does not belong to the user');

        project.isFavorite = !project.isFavorite;
        await this.projectMembersRepository.save(project);
    }

    async getPlotsOfProject(projectId: string, userId: string) {
        const isMember = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
            isPending: false,
        });

        if (!isMember)
            throw new UnauthorizedException('Project does not belong to the user');

        const project = await this.projectsRepository.findOneBy({
            id: projectId,
        });

        if (!project)
            throw new NotFoundException('Project not found or does not belong to the user');

        const plots = await this.projectPlotsRepository
            .createQueryBuilder('plot')
            .addSelect(['plot.dvf', 'plot.dpe', 'plot.urbanPermits', 'plot.plu', 'plot.buildings', 'plot.risks', 'plot.climate', 'plot.proximity'])
            .where('plot.projectId = :projectId', { projectId })
            .getMany();

        // The raw snapshots can be large: only a digest goes to the client.
        return plots.map(({ dvf, dpe, urbanPermits, plu, buildings, risks, climate, proximity, cadastreProperties, addressProperties, ...plot }) => ({
            ...plot,
            summary: buildPlotSummary({ dvf, dpe, urbanPermits, plu, buildings, risks, climate, proximity } as ProjectPlots),
        }));
    }

    async inviteUserToProject(inviteUserDto: InviteUserDto, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: inviteUserDto.projectId,
        });

        if (!project)
            throw new NotFoundException('Projet introuvable. Réessayez plus tard.');

        const inviter = await this.usersRepository.findOneBy({
            id: userId,
        });

        if (!inviter)
            throw new NotFoundException('Utilisateur introuvable.');

        const isInviterAdmin = await this.projectMembersRepository.findOneBy({
            projectId: inviteUserDto.projectId,
            userId: userId,
            isAdmin: true,
            isPending: false,
        });

        if (!isInviterAdmin)
            throw new ForbiddenException('Seuls les administrateurs du projet peuvent inviter des membres.');

        const newMember = await this.usersRepository.findOneBy({
            email: inviteUserDto.email,
        });

        if (!newMember)
            throw new NotFoundException('Utilisateur introuvable.');

        const existingMember = await this.projectMembersRepository.findOneBy({
            projectId: inviteUserDto.projectId,
            userId: newMember.id,
        });

        if (existingMember && !existingMember.isPending)
            throw new ConflictException('Cet utilisateur est déjà membre du projet.');

        const inviterName = `${inviter.firstName} ${inviter.surName}`;
        const verificationToken = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + INVITATION_VALIDITY_MS);

        // An invitation that is still pending is re-sent: same member row, fresh token and expiry.
        const isNewMember = !existingMember;
        const member = existingMember ?? await this.projectMembersRepository.save(
            this.projectMembersRepository.create({
                userId: newMember.id,
                projectId: inviteUserDto.projectId,
                isAdmin: false,
                role: 'member',
                isPending: true,
            }),
        );

        const existingInvite = await this.projectInviteRepository.findOneBy({
            userId: newMember.id,
            projectId: inviteUserDto.projectId,
        });
        const isNewInvite = !existingInvite;
        const invite = existingInvite ?? this.projectInviteRepository.create({
            userId: newMember.id,
            projectId: inviteUserDto.projectId,
        });
        invite.memberId = member.id;
        invite.projectName = project.name;
        invite.inviterName = inviterName;
        invite.verificationToken = verificationToken;
        invite.expiresAt = expiresAt;
        invite.status = 'pending';
        await this.projectInviteRepository.save(invite);

        try {
            await this.mailService.sendProjectInvitationEmail(newMember.email, project.name, inviterName, verificationToken);
        } catch (error) {
            // Do not leave an orphan pending member when the mail could not be sent.
            if (isNewInvite)
                await this.projectInviteRepository.delete({ id: invite.id });
            if (isNewMember)
                await this.projectMembersRepository.delete({ id: member.id });
            throw error;
        }

        if (!invite.notificationId) {
            try {
                const notification = await this.notificationService.createNotification(
                    newMember.id,
                    NotificationType.PROJECT_INVITATION,
                    'Invitation à un projet',
                    `${inviterName} vous invite à rejoindre le projet ${project.name}`,
                    { inviterName, projectName: project.name, projectId: project.id, memberId: member.id },
                );
                invite.notificationId = notification.id;
                await this.projectInviteRepository.save(invite);
            } catch (error) {
                // The mail is the primary channel: a failed notification must not fail the invitation.
                console.error('Error creating project invitation notification:', error);
            }
        }
    }

    private async findUsableInvite(token: string): Promise<ProjectInvite> {
        const invite = await this.projectInviteRepository.findOneBy({ verificationToken: token });

        if (!invite || invite.status !== 'pending' || !invite.projectId || !invite.memberId)
            throw new NotFoundException('Invitation invalide ou déjà traitée.');
        if (!invite.expiresAt || invite.expiresAt.getTime() < Date.now())
            throw new GoneException('Cette invitation a expiré. Demandez à un administrateur du projet de vous la renvoyer.');

        return invite;
    }

    async getInvitationByToken(token: string) {
        const invite = await this.findUsableInvite(token);

        return {
            projectName: invite.projectName,
            inviterName: invite.inviterName,
        };
    }

    async respondToInvitationByToken(token: string, accept: boolean) {
        const invite = await this.findUsableInvite(token);

        const member = await this.projectMembersRepository.findOneBy({ id: invite.memberId! });
        if (!member || !member.isPending) {
            invite.status = 'cancelled';
            invite.verificationToken = null;
            await this.projectInviteRepository.save(invite);
            throw new NotFoundException('Invitation invalide ou déjà traitée.');
        }

        await this.applyInvitationResponse(member, invite, accept);
        return { accepted: accept, projectName: invite.projectName };
    }

    // Answer from the in-app notification: the connected user must be the invitee.
    async respondToInvitation(projectId: string, memberId: string, userId: string, accept: boolean) {
        const member = await this.projectMembersRepository.findOneBy({
            id: memberId,
            projectId: projectId,
            userId: userId,
            isPending: true,
        });

        if (!member)
            throw new NotFoundException('Invitation invalide ou déjà traitée.');

        const invite = await this.projectInviteRepository.findOneBy({ memberId: member.id, status: 'pending' });
        if (invite && invite.expiresAt && invite.expiresAt.getTime() < Date.now())
            throw new GoneException('Cette invitation a expiré. Demandez à un administrateur du projet de vous la renvoyer.');

        await this.applyInvitationResponse(member, invite, accept);
    }

    private async applyInvitationResponse(member: ProjectMembers, invite: ProjectInvite | null, accept: boolean) {
        if (accept) {
            member.isPending = false;
            member.joinedAt = new Date();
            await this.projectMembersRepository.save(member);
            await this.projectsRepository.increment({ id: member.projectId }, 'numberOfMembers', 1);
        } else {
            await this.projectMembersRepository.delete({ id: member.id });
        }

        if (!invite)
            return;

        invite.status = accept ? 'accepted' : 'declined';
        invite.verificationToken = null;
        await this.projectInviteRepository.save(invite);

        if (invite.notificationId) {
            try {
                await this.notificationService.markAsRead(invite.notificationId, member.userId);
            } catch (error) {
                console.error('Error marking invitation notification as read:', error);
            }
        }
    }

    async getProjectMembers(projectId: string, userId: string) {
        const members = await this.projectMembersRepository.find({
            where: { projectId: projectId },
            order: { isAdmin: "DESC", joinedAt: "ASC" },
        });

        for (const member of members) {
            const user = await this.usersRepository.findOneBy({ id: member.userId });
            if (!user)
                continue;
            member['user'] = {
                firstName: user.firstName,
                surName: user.surName,
                email: user.email,
                profilePicture: user.profilePicture,
            };
        }

        for (const member of members) {
            if (member.userId === userId) {
                member['isCurrentUser'] = true;
            } else {
                member['isCurrentUser'] = false;
            }
            delete (member as any).userId;
            delete (member as any).projectId;
            delete (member as any).isFavorite;
        }

        return members;
    }

    async deletePlotFromProject(id: string, userId: string) {
        const projectPlot = await this.projectPlotsRepository.findOneBy({
            id: id,
        });

        if (!projectPlot)
            throw new NotFoundException('Plot not found or does not belong to the user');

        const isMember = await this.projectMembersRepository.findOneBy({
            projectId: projectPlot.projectId,
            userId: userId,
            isPending: false,
        });

        if (!isMember)
            throw new UnauthorizedException('Project does not belong to the user');

        await this.projectPlotsRepository.delete({ id: id });

        const project = await this.projectsRepository.findOneBy({
            id: projectPlot.projectId,
        });

        if (project) {
            project.numberOfPlots -= 1;
            await this.projectsRepository.save(project);
        }
    }

    async removeMemberFromProject(projectId: string, memberId: string, userId: string) {
        const project = await this.projectsRepository.findOneBy({
            id: projectId,
        });

        if (!project)
            throw new NotFoundException('Projet introuvable. Réessayez plus tard.');

        const isAdmin = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            userId: userId,
            isAdmin: true,
        });

        if (!isAdmin)
            throw new UnauthorizedException('Vous n\'avez pas les permissions pour supprimer des membres de ce projet.');

        const memberToRemove = await this.projectMembersRepository.findOneBy({
            projectId: projectId,
            id: memberId,
        });

        if (!memberToRemove)
            throw new NotFoundException('Membre introuvable.');

        await this.projectMembersRepository.delete({ id: memberToRemove.id });
        // Removing a pending member cancels its invitation; only accepted members were counted.
        if (memberToRemove.isPending) {
            await this.projectInviteRepository.update(
                { memberId: memberToRemove.id, status: 'pending' },
                { status: 'cancelled', verificationToken: null },
            );
        } else {
            project.numberOfMembers -= 1;
            await this.projectsRepository.save(project);
        }
    }

    async getDocumentsOfProject(projectId: string) {
        return this.projectDocumentsRepository.find({
            where: { projectId: projectId, isUploaded: true },
            order: { createdAt: "DESC" },
        });
    }

    async getUsedStorage(userId: string, excludedDocumentId?: string): Promise<number> {
        const documents = await this.projectDocumentsRepository.find({
            where: [
                { uploadedBy: userId, isUploaded: true },
                { uploadedBy: userId, isUploaded: false, createdAt: MoreThan(new Date(Date.now() - PENDING_UPLOAD_WINDOW_MS)) },
            ],
            select: { id: true, size: true },
        });

        return documents
            .filter(document => document.id !== excludedDocumentId)
            .reduce((total, document) => total + document.size, 0);
    }

    async getStorageUsage(userId: string) {
        return { used: await this.getUsedStorage(userId), quota: USER_STORAGE_QUOTA };
    }

    async requestDocumentUpload(projectId: string, requestDocumentUploadDto: RequestDocumentUploadDto, userId: string) {
        const allowedType = ALLOWED_DOCUMENT_TYPES[requestDocumentUploadDto.mimetype];
        const extension = requestDocumentUploadDto.documentName.split('.').pop()?.toLowerCase() ?? '';
        if (!allowedType || !allowedType.extensions.includes(extension))
            throw new BadRequestException('Type de fichier non supporté. Formats acceptés : PDF, DOCX, PNG, JPG, JPEG.');

        if (requestDocumentUploadDto.size > MAX_DOCUMENT_SIZE)
            throw new BadRequestException('Le fichier dépasse la taille maximale de 20 Mo.');

        const usedStorage = await this.getUsedStorage(userId);
        if (usedStorage + requestDocumentUploadDto.size > USER_STORAGE_QUOTA)
            throw new BadRequestException('Vous avez atteint votre limite de stockage de 1 Go.');

        const id = randomUUID();
        const storageKey = `projects/${projectId}/${id}`;
        const document = this.projectDocumentsRepository.create({
            id: id,
            projectId: projectId,
            documentName: requestDocumentUploadDto.documentName,
            mimetype: requestDocumentUploadDto.mimetype,
            documentType: allowedType.documentType,
            size: requestDocumentUploadDto.size,
            storageKey: storageKey,
            uploadedBy: userId,
        });

        await this.projectDocumentsRepository.save(document);

        const uploadUrl = await this.storageService.getUploadUrl(storageKey, document.mimetype);

        return { documentId: document.id, uploadUrl: uploadUrl };
    }

    async confirmDocumentUpload(projectId: string, documentId: string) {
        const document = await this.projectDocumentsRepository.findOneBy({
            id: documentId,
            projectId: projectId,
        });

        if (!document)
            throw new NotFoundException('Document introuvable.');

        const size = document.storageKey ? await this.storageService.getObjectSize(document.storageKey) : null;

        if (size === null)
            throw new BadRequestException('Le fichier n\'a pas été envoyé.');

        if (size > MAX_DOCUMENT_SIZE) {
            await this.deleteStoredObject(document.storageKey);
            await this.projectDocumentsRepository.delete({ id: document.id });
            throw new BadRequestException('Le fichier dépasse la taille maximale de 20 Mo.');
        }

        // The size declared at upload-url time is not trusted: re-check the quota with the real size.
        const usedStorage = document.uploadedBy ? await this.getUsedStorage(document.uploadedBy, document.id) : 0;
        if (usedStorage + size > USER_STORAGE_QUOTA) {
            await this.deleteStoredObject(document.storageKey);
            await this.projectDocumentsRepository.delete({ id: document.id });
            throw new BadRequestException('Vous avez atteint votre limite de stockage de 1 Go.');
        }

        document.size = size;
        document.isUploaded = true;
        return this.projectDocumentsRepository.save(document);
    }

    async getDocumentDownloadUrl(projectId: string, documentId: string, disposition: 'inline' | 'attachment' = 'attachment') {
        const document = await this.projectDocumentsRepository.findOneBy({
            id: documentId,
            projectId: projectId,
            isUploaded: true,
        });

        if (!document || !document.storageKey)
            throw new NotFoundException('Document introuvable.');

        const url = await this.storageService.getDownloadUrl(document.storageKey, document.documentName, disposition);

        return { url: url };
    }

    async deleteDocumentFromProject(projectId: string, documentId: string) {
        const document = await this.projectDocumentsRepository.findOneBy({
            id: documentId,
            projectId: projectId,
        });

        if (!document)
            throw new NotFoundException('Document introuvable.');

        await this.deleteStoredObject(document.storageKey);
        await this.projectDocumentsRepository.delete({ id: document.id });
    }

    private async deleteStoredObject(storageKey: string | null): Promise<void> {
        if (storageKey)
            await this.storageService.deleteObject(storageKey);
    }
}
