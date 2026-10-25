import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from 'react-hot-toast';

import { getAllFeedbacks, deleteFeedback } from "../../../../requests/feedback"; 
import FeedbacksTable from "./FeedbacksTable";
import BentoCard from "../../../map/components/layers/Dashboard/BentoCard";
import AdminSearchInput from "../shared/AdminSearchInput";

const FeedbacksList = () => {
    const [query, setQuery] = useState("");
    const queryClient = useQueryClient();

    const { data: allFeedbacks = [], isLoading } = useQuery({
        queryKey: ["feedbacks"],
        queryFn: getAllFeedbacks,
    });

    const { mutate: mutateDelete, isPending: isDeletePending } = useMutation({
        mutationFn: (id: string) => deleteFeedback(id),
        onSuccess: () => {
            toast.success("Feedback supprimé avec succès.");
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
        },
        onError: () => toast.error("Impossible de supprimer ce feedback.")
    });

    const filteredFeedbacks = allFeedbacks.filter((fb: any) => {
        const searchStr = query.toLowerCase();
        const titleMatch = fb.title?.toLowerCase().includes(searchStr);
        const descMatch = fb.description?.toLowerCase().includes(searchStr);
        const authorMatch = fb.user?.firstName?.toLowerCase().includes(searchStr) || 
                            fb.user?.surName?.toLowerCase().includes(searchStr) || 
                            fb.user?.email?.toLowerCase().includes(searchStr);
        return titleMatch || descMatch || authorMatch;
    });

    return (
        <BentoCard
            title="Retours et suggestions"
            className="primo-page-enter"
            action={
                <div className="flex items-center gap-2">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                    <AdminSearchInput value={query} placeholder="Rechercher par titre, auteur..." onChange={setQuery} />
                </div>
            }
        >
            <FeedbacksTable 
                feedbacks={filteredFeedbacks} 
                isWorking={isLoading} 
                isDeletePending={isDeletePending} 
                onDelete={(id) => mutateDelete(id)} 
            />
        </BentoCard>
    );
};

export default FeedbacksList;