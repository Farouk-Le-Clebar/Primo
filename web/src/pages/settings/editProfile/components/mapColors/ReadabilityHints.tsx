import { TriangleAlert } from "lucide-react";
import { MIN_STROKE_CONTRAST } from "../../../../../utils/contrast";
import type { ReadabilityIssue } from "../../../../../utils/contrast";
import { PARCEL_STATE_LABELS } from "../../../../../utils/mapColors";

type ReadabilityHintsProps = {
  issues: ReadabilityIssue[];
};

const formatRatio = (ratio: number): string => ratio.toFixed(1).replace(".", ",");

const getIssueMessage = (issue: ReadabilityIssue): string => {
  if (issue.kind === "stroke-background") {
    return `Contour « ${PARCEL_STATE_LABELS[issue.state]} » peu visible sur le fond (${formatRatio(issue.ratio)}:1, ${MIN_STROKE_CONTRAST}:1 conseillé).`;
  }
  if (issue.kind === "fill-background") {
    return `Remplissage « ${PARCEL_STATE_LABELS[issue.state]} » presque invisible sur le fond.`;
  }
  const [first, second] = issue.states;
  return `« ${PARCEL_STATE_LABELS[first]} » et « ${PARCEL_STATE_LABELS[second]} » sont difficiles à distinguer.`;
};

export default function ReadabilityHints({ issues }: ReadabilityHintsProps) {
  return (
    <div role="status">
      {issues.length > 0 && (
        <ul className="flex flex-col gap-1.5 px-4 py-3">
          {issues.map((issue) => {
            const message = getIssueMessage(issue);
            return (
              <li key={message} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {message}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
