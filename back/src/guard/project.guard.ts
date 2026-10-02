import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ProjectsService } from "src/projects/projects.service";
import { UnauthorizedException } from "@nestjs/common";

@Injectable()
export class ProjectGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly projectsService: ProjectsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const projectId = request.params.projectId || request.body.projectId;
        if (!projectId)
            return false;
        const token = request.headers.authorization?.split(' ')[1];
        if (!token)
            return false;
        const payload = await this.jwtService.verifyAsync(token);
        const userId = payload.sub;
        if (!userId)
            return false;

        const isMember = await this.projectsService.userIsMemberOfProject(userId, projectId);
        if (!isMember)
            throw new UnauthorizedException('User is not a member of this project');
        return true;
    }
}
