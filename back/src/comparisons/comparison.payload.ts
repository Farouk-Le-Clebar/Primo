import { ProjectNotes } from '../database/project-notes.entity';
import { ProjectPlots } from '../database/project-plots.entity';
import { buildPlotSummary } from '../projects/plot-summary';
import { comparisonSystemPrompt } from './comparison.prompt';
import { ComparisonResult } from './comparison.types';

// Reasoning tokens count against this limit: it must leave room for the ~1.5k-token JSON answer after the thinking.
const MAX_OUTPUT_TOKENS = 8000;
const RESULT_WINNERS = ['A', 'B'];
const CONFIDENCES = ['faible', 'moyenne', 'elevee'];

// Digest of one plot: identity + per-source summary, never the raw snapshots (too large for a prompt).
export function buildPlotPayload(plot: ProjectPlots) {
const summary = buildPlotSummary(plot);
return {
        identity: {
            address: plot.adress,
            cadastralId: plot.plotId,
            cadastralRef: plot.section && plot.parcelNumber ? `${plot.section} ${plot.parcelNumber}` : null,
            communeCode: plot.communeCode,
            department: plot.department,
            surfaceM2: plot.surfaceM2,
        },
        summary: summary,
        dataGaps: Object.entries(summary).filter(([, value]) => value === null).map(([source]) => source),
    };
}

// Total size of the project notes sent to the model, so they cannot blow up the prompt.
const MAX_NOTES_CHARS = 6000;

export function buildNotesPayload(notes: Pick<ProjectNotes, 'title' | 'content'>[]) {
    let remaining = MAX_NOTES_CHARS;
    const result: { title: string; content: string }[] = [];

    for (const note of notes) {
        const content = note.content.trim();
        if (!content || remaining <= 0)
            continue;
        const truncated = content.slice(0, remaining);
        remaining -= truncated.length;
        result.push({ title: note.title.trim(), content: truncated });
    }
    return result;
}

export function buildComparisonPayload(plotA: ProjectPlots, plotB: ProjectPlots, question: string | null, notes: Pick<ProjectNotes, 'title' | 'content'>[] = []) {
    return {
        brief: question ?? '',
        projectNotes: buildNotesPayload(notes),
        plots: { A: buildPlotPayload(plotA), B: buildPlotPayload(plotB) },
    };
}

// Request body ready to POST to OpenRouter (https://openrouter.ai/api/v1/chat/completions).
// Sent by ComparisonsService.runComparison.
export function buildOpenRouterRequest(model: string, payload: Record<string, any>) {
    return {
        model: model,
        temperature: 0.2,
        max_tokens: MAX_OUTPUT_TOKENS,
        // Reasoning tokens are billed as output: keep them low, the digest already contains the analysis material.
        reasoning: { effort: 'low' as const },
        response_format: { type: 'json_object' as const },
        messages: [
            { role: 'system' as const, content: comparisonSystemPrompt },
            { role: 'user' as const, content: JSON.stringify(payload) },
        ],
    };
}

// Validates the raw model answer; throws a readable error so the comparison can be marked "failed".
export function parseComparisonResult(raw: string): ComparisonResult {
    const json = raw.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
    const result = JSON.parse(json);

    if (!RESULT_WINNERS.includes(result?.winner))
        throw new Error('Réponse invalide : "winner" doit valoir "A" ou "B".');
    if (!CONFIDENCES.includes(result.confidence))
        throw new Error('Réponse invalide : "confidence" inconnue.');
    if (typeof result.headline !== 'string' || typeof result.summary !== 'string')
        throw new Error('Réponse invalide : "headline" et "summary" sont requis.');
    if (!Array.isArray(result.criteria) || !result.plots?.A || !result.plots?.B)
        throw new Error('Réponse invalide : "criteria" et "plots" sont requis.');

    return {
        ...result,
        caveats: Array.isArray(result.caveats) ? result.caveats : [],
        nextSteps: Array.isArray(result.nextSteps) ? result.nextSteps : [],
    };
}
