import { useParams } from "react-router-dom";
import OverviewKpis from "./OverviewKpis";
import OverviewPlots from "./OverviewPlots";
import OverviewActivity from "./OverviewActivity";
import OverviewAround from "./OverviewAround";
import OverviewNotes from "./OverviewNotes";
import { useProjectNotes, useProjectPlots } from "./useProjectData";

export default function DashboardProjects() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: plots = [], isPending } = useProjectPlots(projectId);
  const { data: notes = [] } = useProjectNotes(projectId);

  if (isPending || !projectId)
    return (
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="primo-card h-[120px] animate-pulse motion-reduce:animate-none" />
        ))}
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <OverviewKpis plots={plots} />
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex min-w-0 flex-col gap-4">
          <OverviewPlots plots={plots} />
          <OverviewAround plots={plots} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <OverviewActivity projectId={projectId} />
          <OverviewNotes notes={notes} plots={plots} />
        </div>
      </div>
    </div>
  );
}
