export type PlotSide = 'A' | 'B';

export type ComparisonCriterionKey =
    | 'marche' | 'urbanisme' | 'risques' | 'energie' | 'autorisations'
    | 'batiments' | 'climat' | 'proximite' | 'surface';

// Shape the model must answer with; stored as-is in `project_plot_comparisons.result`.
export type ComparisonResult = {
    winner: PlotSide;
    confidence: 'faible' | 'moyenne' | 'elevee';
    headline: string;
    summary: string;
    criteria: {
        key: ComparisonCriterionKey;
        label: string;
        weight: 'majeur' | 'important' | 'secondaire';
        winner: PlotSide | 'egalite' | 'indetermine';
        analysis: string;
    }[];
    plots: Record<PlotSide, { strengths: string[]; weaknesses: string[] }>;
    caveats: string[];
    nextSteps: string[];
};
