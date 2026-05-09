import { useParams } from "react-router-dom";

const DashboardProjects = () => {
    const { projectId } = useParams();

    return (
    <div className="text-black dark:invert items-center justify-center">
        projectId : {projectId}
    </div>
  );
};

export default DashboardProjects;