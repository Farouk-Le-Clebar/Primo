import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from 'react-hot-toast';
import { Card, TextInput, Title, Text } from "@tremor/react";

import { getAllFeedbacks, deleteFeedback } from "../../../../requests/feedback"; 
import FeedbacksTable from "./FeedbacksTable";

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
        <Card className="w-full rounded-xl border border-gray-100 dark:border-white/5 transition-colors duration-200 ring-0 dark:ring-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <Title className="text-gray-900 dark:text-white flex items-center gap-2">
                        Retours et Suggestions
                        {isLoading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                    </Title>
                    <Text className="text-gray-500 dark:text-gray-400">
                        Consultez et gérez les feedbacks laissés par vos utilisateurs.
                    </Text>
                </div>
                <div className="w-full sm:w-72">
                    <TextInput
                        icon={Search}
                        placeholder="Rechercher par titre, auteur..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white"
                    />
                </div>
            </div>
            
            <FeedbacksTable 
                feedbacks={filteredFeedbacks} 
                isWorking={isLoading} 
                isDeletePending={isDeletePending} 
                onDelete={(id) => mutateDelete(id)} 
            />
        </Card>
    );
};

export default FeedbacksList;