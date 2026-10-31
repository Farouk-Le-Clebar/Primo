import axios from 'axios';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProjectPlotComparison } from '../database/project-plot-comparison.entity';
import { ProjectPlots } from '../database/project-plots.entity';
import { CreateComparisonDto } from './comparison.dto';
import { buildComparisonPayload, buildOpenRouterRequest, parseComparisonResult } from './comparison.payload';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_TIMEOUT_MS = 120000;
// A comparison still pending after this long was lost (server restart...): it is reported as failed.
const STALE_PENDING_MS = 5 * 60 * 1000;

const HEAVY_PLOT_COLUMNS = ['plot.dvf', 'plot.dpe', 'plot.urbanPermits', 'plot.plu', 'plot.buildings', 'plot.risks', 'plot.climate', 'plot.proximity'];

@Injectable()
export class ComparisonsService {
    private readonly logger = new Logger(ComparisonsService.name);

    constructor(
        @InjectRepository(ProjectPlotComparison)
        private comparisonsRepository: Repository<ProjectPlotComparison>,
        @InjectRepository(ProjectPlots)
        private projectPlotsRepository: Repository<ProjectPlots>,
        private configService: ConfigService,
    ) { }

    async create(projectId: string, dto: CreateComparisonDto, userId: string) {
        if (dto.plotAId === dto.plotBId)
            throw new BadRequestException('Il faut choisir deux parcelles différentes.');

        const plots = await this.projectPlotsRepository
            .createQueryBuilder('plot')
            .addSelect(HEAVY_PLOT_COLUMNS)
            .where('plot.projectId = :projectId', { projectId })
            .andWhere({ id: In([dto.plotAId, dto.plotBId]) })
            .getMany();

        const plotA = plots.find(plot => plot.id === dto.plotAId);
        const plotB = plots.find(plot => plot.id === dto.plotBId);
        if (!plotA || !plotB)
            throw new NotFoundException('Parcelle introuvable dans ce projet.');

        const question = dto.question?.trim() || null;
        const comparison = await this.comparisonsRepository.save(this.comparisonsRepository.create({
            projectId: projectId,
            plotAId: plotA.id,
            plotBId: plotB.id,
            plotALabel: plotA.adress,
            plotBLabel: plotB.adress,
            createdBy: userId,
            question: question,
            status: 'pending',
            model: this.configService.get<string>('OPENROUTER_MODEL') ?? null,
            inputSnapshot: buildComparisonPayload(plotA, plotB, question),
        }));

        // The model takes several seconds to answer: the client polls the comparison until it leaves "pending".
        void this.runComparison(comparison.id);

        return this.getOne(projectId, comparison.id);
    }

    private async runComparison(comparisonId: string): Promise<void> {
        try {
            const comparison = await this.comparisonsRepository
                .createQueryBuilder('comparison')
                .addSelect('comparison.inputSnapshot')
                .where('comparison.id = :comparisonId', { comparisonId })
                .getOne();
            if (!comparison?.inputSnapshot)
                throw new Error('Données de comparaison introuvables.');

            const apiKey = this.configService.get<string>('OPENROUTER_APIKEY');
            const model = this.configService.get<string>('OPENROUTER_MODEL');
            if (!apiKey || !model)
                throw new Error('OpenRouter n\'est pas configuré (OPENROUTER_APIKEY, OPENROUTER_MODEL).');

            const response = await axios.post(OPENROUTER_URL, buildOpenRouterRequest(model, comparison.inputSnapshot), {
                headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-Title': 'Primo' },
                timeout: OPENROUTER_TIMEOUT_MS,
            });

            const choice = response.data?.choices?.[0];
            const content: unknown = choice?.message?.content;
            if (typeof content !== 'string' || !content.trim())
                throw new Error('Le modèle n\'a renvoyé aucune réponse.');
            if (choice.finish_reason === 'length') {
                this.logger.warn(`Comparaison ${comparisonId} tronquée, usage : ${JSON.stringify(response.data?.usage)}`);
                throw new Error('La réponse du modèle a été tronquée.');
            }

            await this.comparisonsRepository.update(comparisonId, {
                status: 'completed',
                result: parseComparisonResult(content) as unknown as Record<string, any>,
                errorMessage: null,
                completedAt: new Date(),
            });
        } catch (error) {
            const message = this.describeError(error);
            this.logger.error(`Comparaison ${comparisonId} échouée : ${message}`);
            await this.comparisonsRepository.update(comparisonId, { status: 'failed', errorMessage: message, completedAt: new Date() });
        }
    }

    // Never exposes request headers (the API key lives there).
    private describeError(error: unknown): string {
        if (axios.isAxiosError(error))
            return error.response?.data?.error?.message ?? (error.code === 'ECONNABORTED' ? 'Le modèle a mis trop de temps à répondre.' : error.message);
        return error instanceof Error ? error.message : String(error);
    }

    private async failIfStale(comparison: ProjectPlotComparison) {
        if (comparison.status !== 'pending' || Date.now() - comparison.createdAt.getTime() < STALE_PENDING_MS)
            return comparison;
        comparison.status = 'failed';
        comparison.errorMessage = 'L\'analyse n\'a pas abouti. Relancez la comparaison.';
        comparison.completedAt = new Date();
        // Only while still pending, so a late answer of the model is never overwritten.
        await this.comparisonsRepository.update({ id: comparison.id, status: 'pending' }, { status: comparison.status, errorMessage: comparison.errorMessage, completedAt: comparison.completedAt });
        return comparison;
    }

    async list(projectId: string) {
        const comparisons = await this.comparisonsRepository.find({
            where: { projectId: projectId },
            order: { createdAt: 'DESC' },
        });
        return Promise.all(comparisons.map(comparison => this.failIfStale(comparison)));
    }

    async getOne(projectId: string, comparisonId: string) {
        const comparison = await this.comparisonsRepository.findOneBy({ id: comparisonId, projectId: projectId });
        if (!comparison)
            throw new NotFoundException('Comparaison introuvable.');
        return this.failIfStale(comparison);
    }

    async remove(projectId: string, comparisonId: string) {
        await this.getOne(projectId, comparisonId);
        await this.comparisonsRepository.delete({ id: comparisonId });
    }
}
