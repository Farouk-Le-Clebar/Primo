export type ComparisonStatus = "pending" | "completed" | "failed";
export type PlotSide = "A" | "B";

export type ComparisonResult = {
    winner: PlotSide;
    confidence: "faible" | "moyenne" | "elevee";
    headline: string;
    summary: string;
    criteria: {
        key: string;
        label: string;
        weight: "majeur" | "important" | "secondaire";
        winner: PlotSide | "egalite" | "indetermine";
        analysis: string;
    }[];
    plots: Record<PlotSide, { strengths: string[]; weaknesses: string[] }>;
    caveats: string[];
    nextSteps: string[];
};

export type PlotComparison = {
    id: string;
    projectId: string;
    plotAId: string;
    plotBId: string;
    plotALabel: string;
    plotBLabel: string;
    question: string | null;
    status: ComparisonStatus;
    model: string | null;
    result: ComparisonResult | null;
    errorMessage: string | null;
    createdAt: string;
    completedAt: string | null;
};

export type CreateComparisonPayload = {
    plotAId: string;
    plotBId: string;
    question?: string;
};
