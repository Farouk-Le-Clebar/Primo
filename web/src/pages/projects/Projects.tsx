import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextInput, Button, Card, Title, Text } from '@tremor/react';
import { useQuery } from "@tanstack/react-query";
import { Star, Search, Plus } from "lucide-react";
import { useState } from 'react';
import LoadingPrimoLogo from '../../components/animations/LoadingPrimoLogo';
import type { ProjectResponse } from '../../types/project/projects';
import { getProjects } from '../../requests/projects';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const { data: projects, isPending } = useQuery<ProjectResponse[]>({
        queryKey: ['projects'],
        queryFn: getProjects,
        refetchOnWindowFocus: false,
    });

    const filteredProjects = projects?.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <Button icon={Plus} size="sm" className='bg-black hover:bg-black/85 dark:hover:bg-white/85 dark:bg-white border-none cursor-pointer'>
                            Créer un projet
                        </Button>
                    </div>
                </div>

                <Table className="mt-2">
                    <TableHead>
                        <TableRow className="border-b border-gray-200 dark:border-white/5">
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400">Nom du projet</TableHeaderCell>
                            <TableHeaderCell className="text-center text-gray-500 dark:text-gray-400">Nombre de parcelles</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400">Date de création</TableHeaderCell>
                            <TableHeaderCell className="text-right text-gray-500 dark:text-gray-400">Favori</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProjects?.map((project: ProjectResponse) => (
                            <TableRow onClick={() => navigate(`/projects/${project.id}`)} key={project.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-default border-b border-gray-100 dark:border-white/5 last:border-none cursor-pointer">
                                <TableCell className="font-medium text-gray-900 dark:text-gray-200">
                                    {project.name}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-400 text-center font-medium">
                                    {project.numberOfPlots}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-400">
                                    {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <button className="p-2 outline-none focus:outline-none hover:scale-110 active:scale-95 transition-transform">
                                        <Star
                                            className={`w-5 h-5 cursor-pointer ${project.isFavorite ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500'}`}
                                            fill={project.isFavorite ? "currentColor" : "none"}
                                        />
                                    </button>
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
        </div>
    );
}