import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextInput, Button, Card, Title, Text } from '@tremor/react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Search, Plus, Ellipsis, Trash, X, Check } from "lucide-react";
import { useState } from 'react';
import LoadingPrimoLogo from '../../components/animations/LoadingPrimoLogo';
import type { ProjectResponse } from '../../types/project/projects';
import { deleteProject, getProjects, toggleFavorite } from '../../requests/projects';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CreateProjectModal from './CreateProjectModal';

export default function Projects() {
    const [searchQuery, setSearchQuery] = useState("");
    const [actualTogglingFavorite, setActualTogglingFavorite] = useState<string | null>(null);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: projects, isPending } = useQuery<ProjectResponse[]>({
        queryKey: ['projects'],
        queryFn: getProjects,
        refetchOnWindowFocus: false,
    });

    const { mutate: toggleFavoriteMutation, isPending: isTogglingFavorite } = useMutation({
        mutationFn: (projectId: string) => toggleFavorite(projectId),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: () => {
            toast.error("Une erreur est survenue lors de la mise à jour du favori. Veuillez réessayer.");
        },
        onSettled: () => {
            setActualTogglingFavorite(null);
        }
    });

    const { mutate: deleteProjectMutation } = useMutation({
        mutationFn: (projectId: string) => deleteProject(projectId),
        onSuccess: () => {
            toast.success("Projet supprimé avec succès.");
            return queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: () => {
            toast.error("Une erreur est survenue lors de la suppression du projet. Veuillez réessayer.");
        }
    });

    const filteredProjects = projects?.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleFavorite = (projectId: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setActualTogglingFavorite(projectId);
        toggleFavoriteMutation(projectId);
    };

    if (isPending) {
        return (
            <div className='flex items-center justify-center w-full h-full bg-transparent dark:bg-[#0A0A0A] transition-colors duration-200'>
                <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full p-4 pl-10 pr-10 overflow-hidden bg-transparent dark:bg-[#0A0A0A] transition-colors duration-200">
            <div className="mb-6">
                <h1 className="font-inter font-bold text-3xl text-gray-900 dark:text-white transition-colors duration-200">
                    Projets
                </h1>
                <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                    Consultez et gérez l'ensemble de vos projets et parcelles.
                </p>
            </div>

            <Card className="w-full h-80/100 scrollbar-custom flex-1 flex flex-col rounded-xl border border-gray-100 dark:border-white/5 transition-colors duration-200 ring-0 dark:ring-0">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <Title className="text-gray-900 dark:text-white flex items-center gap-2">
                            Liste des projets
                        </Title>
                        <Text className="text-gray-500 dark:text-gray-400">
                            Retrouvez vos projets récents et favoris.
                        </Text>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={Search}
                                placeholder="Rechercher un projet..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white"
                            />
                        </div>
                        <Button icon={Plus} size="sm" className='bg-black hover:bg-black/85 dark:hover:bg-white/85 dark:bg-white border-none cursor-pointer' onClick={() => setIsCreateModalOpen(true)}>
                            Créer un projet
                        </Button>
                    </div>
                </div>

                <Table className="mt-2">
                    <TableHead>
                        <TableRow className="border-b border-gray-200 dark:border-white/5">
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-left">Nom du projet</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-center">Parcelles</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-center">Date de création</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-right">
                                <div className="flex justify-end pr-2">
                                    <Ellipsis className='w-5 h-5' />
                                </div>
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProjects?.map((project: ProjectResponse) => (
                            <TableRow onClick={() => navigate(`/projects/${project.id}/dashboard`)} key={project.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-default border-b border-gray-100 dark:border-white/5 last:border-none cursor-pointer">
                                <TableCell className="font-medium text-gray-900 dark:text-gray-200 text-left">
                                    {project.name}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-400 font-medium text-center">
                                    {project.numberOfPlots}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-400 text-center">
                                    {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1 min-w-[88px] min-h-[36px]">
                                        {idToDelete === project.id ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-300 hover:text-white transition-colors hover:border-none cursor-pointer border border-gray-400 text-gray-400"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIdToDelete(null);
                                                    }}
                                                    title="Annuler"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-colors cursor-pointer text-white"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteProjectMutation(project.id);
                                                        setIdToDelete(null);
                                                    }}
                                                    title="Confirmer la suppression"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button className="w-9 h-9 flex items-center justify-center p-2 outline-none focus:outline-none hover:scale-110 active:scale-95 transition-transform disabled:cursor-not-allowed"
                                                    onClick={(e) => handleToggleFavorite(project.id, e)}
                                                    disabled={isTogglingFavorite}
                                                    title="Ajouter aux favoris"
                                                >
                                                    {isTogglingFavorite && project.id === actualTogglingFavorite ? (
                                                        <LoadingPrimoLogo className="h-5 w-5 dark:invert" />
                                                    ) : (
                                                        <Star
                                                            className={`w-5 h-5 cursor-pointer ${project.isFavorite ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500'}`}
                                                            fill={project.isFavorite ? "currentColor" : "none"}
                                                        />
                                                    )}
                                                </button>

                                                <button className="w-9 h-9 flex items-center justify-center p-2 outline-none focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIdToDelete(project.id);
                                                    }}
                                                    title="Supprimer le projet"
                                                >
                                                    <Trash className='w-5 h-5 text-red-500 hover:text-red-600' />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredProjects?.length === 0 && !isPending && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400 italic">
                        {searchQuery ? "Aucun projet ne correspond à votre recherche." : "Aucun projet trouvé."}
                    </div>
                )}
            </Card>
            {isCreateModalOpen && (
                <CreateProjectModal
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}
        </div>
    );
}