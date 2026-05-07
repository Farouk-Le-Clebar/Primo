import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { Card, TextInput, Button, Title, Text } from "@tremor/react";

// COMPONENTS
import { getUsers, searchUsers, deleteUser } from "../../../../requests/admin";
import type { UserType } from "../../../../types/admin";
import UsersTable from "./UsersTable";

const UsersList = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [query, setQuery] = useState("");
    const [fromTo, setFromTo] = useState({ from: 0, to: 10 });
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["users", fromTo.from, fromTo.to],
        queryFn: () => getUsers(fromTo.from, fromTo.to),
    });

    useEffect(() => {
        if (data) setUsers(data);
    }, [data]);

    const { mutate: mutateUsers, isPending: isPagePending } = useMutation({
        mutationFn: ({ from, to }: { from: number, to: number }) => getUsers(from, to),
        onSuccess: (data) => setUsers(data),
        onError: () => {
            toast.error("Accès refusé : droits administrateur requis.");
            navigate("/");
        }
    });

    const { mutate: mutateSearch, isPending: isSearchPending } = useMutation({
        mutationFn: () => searchUsers(query),
        onSuccess: (data) => setUsers(data),
        onError: () => toast.error("Erreur lors de la recherche.")
    });

    const { mutate: mutateDelete, isPending: isDeletePending } = useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: (_, deletedId) => {
            toast.success("Utilisateur supprimé avec succès.");
            setUsers((prev) => prev.filter(user => user.id !== deletedId));
            queryClient.invalidateQueries({ queryKey: ["usersChart"] });
        },
        onError: () => toast.error("Impossible de supprimer l'utilisateur.")
    });

    const handleSetFromTo = (from: number, to: number) => {
        setFromTo({ from, to });
        mutateUsers({ from, to });
    };

    const handleQueryChange = (newQuery: string) => {
        setQuery(newQuery);
        if (newQuery.trim() === "") {
            mutateUsers({ from: fromTo.from, to: fromTo.to });
        } else {
            mutateSearch();
        }
    };

    const isWorking = isLoading || isPagePending || isSearchPending;
    const currentPage = Math.floor(fromTo.from / 10) + 1;

    return (
        <Card className="w-full rounded-xl border border-gray-100 dark:border-white/5 transition-colors duration-200 ring-0 dark:ring-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <Title className="text-gray-900 dark:text-white flex items-center gap-2">
                        Liste des utilisateurs
                        {isWorking && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                    </Title>
                    <Text className="text-gray-500 dark:text-gray-400">
                        Gérez les membres inscrits sur la plateforme.
                    </Text>
                </div>
                <div className="w-full sm:w-72">
                    <TextInput
                        icon={Search}
                        placeholder="Rechercher un nom, email..."
                        value={query}
                        onChange={(e) => handleQueryChange(e.target.value)}
                        className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white"
                    />
                </div>
            </div>
            <UsersTable 
                users={users} 
                isWorking={isWorking} 
                isDeletePending={isDeletePending} 
                onDelete={(userId) => mutateDelete(userId)} 
            />
            {query.trim() === "" && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                    
                    <Button 
                        variant="light" 
                        icon={ChevronLeft} 
                        onClick={() => handleSetFromTo(Math.max(0, fromTo.from - 10), Math.max(10, fromTo.to - 10))}
                        disabled={fromTo.from === 0 || isWorking}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white dark:hover:bg-white/5"
                    >
                        Précédent
                    </Button>

                    <div className="hidden sm:flex items-center gap-1">
                        <span className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white text-sm font-medium">
                            {currentPage}
                        </span>
                        
                        {users.length === 10 && (
                            <span className="flex items-center justify-center w-8 h-8 text-gray-400 dark:text-gray-500">
                                ...
                            </span>
                        )}
                    </div>
                    <Button 
                        variant="light" 
                        iconPosition="right"
                        icon={ChevronRight} 
                        onClick={() => handleSetFromTo(fromTo.from + 10, fromTo.to + 10)}
                        disabled={users.length < 10 || isWorking} 
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white dark:hover:bg-white/5"
                    >
                        Suivant
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default UsersList;