import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextInput, Button, Card, Title, Text } from '@tremor/react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Search, Plus, Trash, X, Check, Loader2, Users } from "lucide-react";
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
            toast.error("Une erreur est survenue lors de la mise à jour du favori.");
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
            toast.error("Une erreur est survenue lors de la suppression du projet.");
        }
    });

    const filteredProjects = projects?.filter((project: ProjectResponse & { description?: string }) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
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

            <Card className="w-full h-80/100 scrollbar-custom flex-1 flex flex-col p-0 rounded-xl border border-gray-100 dark:border-white/5 transition-colors duration-200 ring-0 dark:ring-0">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100 dark:border-white/5">
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

                <div className="flex-1 overflow-auto">
                    <Table>
                        <TableHead>
                            <TableRow className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]">
                                <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-left font-medium py-3 px-6">Nom du projet</TableHeaderCell>
                                <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-center font-medium py-3">Parcelles</TableHeaderCell>
                                <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-center font-medium py-3">Membres</TableHeaderCell>
                                <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-right font-medium py-3 px-6">Dernière modif.</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProjects?.map((project: ProjectResponse & { numberOfMembers?: number; description?: string }) => (
                                <TableRow 
                                    key={project.id} 
                                    onClick={() => navigate(`/projects/${project.id}/dashboard`)} 
                                    className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer border-b border-gray-100 dark:border-white/5 last:border-none relative"
                                >
                                    <TableCell className="text-left px-6 py-3">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                {project.isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-current shrink-0" />}
                                                <span className="font-medium text-gray-900 dark:text-gray-200 truncate">{project.name}</span>
                                            </div>
                                            {project.description && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 max-w-xs xl:max-w-md">
                                                    {project.description}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="text-gray-600 dark:text-gray-400 font-medium text-center">
                                        <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-md bg-gray-100 dark:bg-white/[0.01] text-xs">
                                            {project.numberOfPlots}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-gray-600 dark:text-gray-400 font-medium text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-xs">{project.numberOfMembers || 1}</span>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="text-right text-gray-600 dark:text-gray-400 px-6">
                                        <span className={`transition-opacity ${idToDelete === project.id ? "opacity-0" : "opacity-100"}`}>
                                            {new Date(project.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>

                                        <div className="absolute right-6 top-1/2 hidden h-full -translate-y-1/2 items-center bg-gray-50 group-hover:flex dark:bg-white/[0.002] pl-6">
                                            
                                            {idToDelete === project.id ? (
                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <span className="text-xs text-red-500 mr-1 font-medium">Sûr ?</span>
                                                    <div className="inline-flex items-center rounded-md shadow-sm">
                                                        <button 
                                                            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-1.5 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-[#1A1A1A] dark:text-gray-300 dark:ring-white/10 hover:dark:bg-white/5"
                                                            onClick={() => setIdToDelete(null)}
                                                            title="Annuler"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="relative -ml-px inline-flex items-center rounded-r-md bg-red-600 px-3 py-1.5 text-white ring-1 ring-inset ring-red-600 hover:bg-red-700 dark:ring-red-500"
                                                            onClick={() => {
                                                                deleteProjectMutation(project.id);
                                                                setIdToDelete(null);
                                                            }}
                                                            title="Confirmer"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center rounded-md shadow-sm">
                                                    <button 
                                                        type="button"
                                                        className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 hover:text-gray-900 hover:bg-gray-50 focus:z-10 dark:bg-[#1A1A1A] dark:text-gray-300 dark:ring-white/10 hover:dark:text-white hover:dark:bg-white/5"
                                                        onClick={(e) => handleToggleFavorite(project.id, e)}
                                                        disabled={isTogglingFavorite}
                                                        title={project.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                                                    >
                                                        {isTogglingFavorite && project.id === actualTogglingFavorite ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Star 
                                                                className={`w-4 h-4 ${project.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-500 dark:text-gray-400'}`} 
                                                            />
                                                        )}
                                                    </button>
                                                    
                                                    <button 
                                                        type="button"
                                                        className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 hover:text-red-600 hover:bg-red-50 focus:z-10 dark:bg-[#1A1A1A] dark:text-gray-400 dark:ring-white/10 hover:dark:text-red-400 hover:dark:bg-red-950/30"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIdToDelete(project.id);
                                                        }}
                                                        title="Supprimer le projet"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredProjects?.length === 0 && !isPending && (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
                            <p className="italic mb-4">{searchQuery ? "Aucun projet ne correspond à votre recherche." : "Vous n'avez pas encore de projet."}</p>
                            {!searchQuery && (
                                <Button icon={Plus} variant="secondary" onClick={() => setIsCreateModalOpen(true)}>
                                    Créer mon premier projet
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {isCreateModalOpen && (
                <CreateProjectModal
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}
        </div>
    );
}