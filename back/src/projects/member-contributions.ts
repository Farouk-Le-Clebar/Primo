import { Repository } from 'typeorm';
import { ProjectPlots } from '../database/project-plots.entity';
import { ProjectNotes } from '../database/project-notes.entity';
import { ProjectDocuments } from '../database/project-documents.entity';

type CountRow = { userId: string | null; total: string };

type ContributionRepositories = {
    plots: Repository<ProjectPlots>;
    notes: Repository<ProjectNotes>;
    documents: Repository<ProjectDocuments>;
};

const countBy = (repository: Repository<ProjectPlots | ProjectNotes | ProjectDocuments>, alias: string, column: string, projectId: string, extra = ''): Promise<CountRow[]> =>
    repository
        .createQueryBuilder(alias)
        .select(`${alias}.${column}`, 'userId')
        .addSelect('COUNT(*)', 'total')
        .where(`${alias}.projectId = :projectId${extra}`, { projectId })
        .groupBy(`${alias}.${column}`)
        .getRawMany<CountRow>();

export async function countMemberContributions(repositories: ContributionRepositories, projectId: string): Promise<Map<string, number>> {
    const results = await Promise.all([
        countBy(repositories.plots, 'plot', 'addedBy', projectId),
        countBy(repositories.notes, 'note', 'createdBy', projectId),
        countBy(repositories.documents, 'doc', 'uploadedBy', projectId, ' AND doc.isUploaded = true'),
    ]);
    const totals = new Map<string, number>();
    results.flat().forEach(({ userId, total }) => {
        if (userId) totals.set(userId, (totals.get(userId) ?? 0) + Number(total));
    });
    return totals;
}
