import { useParams, useNavigate } from "react-router-dom";
import { ClientProjectPage } from "./components/clientProject/ClientProject";


export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/projects");
    };

    return (
        <div className="flex flex-col bg-cover bg-center min-h-screen">
            <ClientProjectPage projectId={id} onBack={handleBack} />
        </div>
    );
}
