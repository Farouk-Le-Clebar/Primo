import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextInput, Button, Card, Title, Text } from '@tremor/react';
import { useQuery } from "@tanstack/react-query";
import { getUsersOfProject } from "../../../requests/projects";
import { useParams } from "react-router-dom";
import { Search, Plus, Trash, Shield } from "lucide-react";
import { useState } from 'react';
import LoadingPrimoLogo from "../../../components/animations/LoadingPrimoLogo";

const Members = () => {
    const { projectId } = useParams();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: members, isPending } = useQuery({
        queryKey: ['project', projectId, 'members'],
        queryFn: () => getUsersOfProject(projectId!),
        enabled: !!projectId,
    });

    const filteredMembers = members?.filter((member: any) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            member.user?.firstName?.toLowerCase().includes(searchLower) ||
            member.user?.surName?.toLowerCase().includes(searchLower) ||
            member.user?.email?.toLowerCase().includes(searchLower) ||
            member.role?.toLowerCase().includes(searchLower)
        );
    });

    if (isPending) {
        return (
            <div className='flex items-center justify-center w-full h-full bg-transparent dark:bg-[#0A0A0A] transition-colors duration-200'>
                <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full p-4 pl-10 pr-10 overflow-hidden bg-transparent dark:bg-[#0A0A0A] transition-colors duration-200">
            <Card className="w-full h-80/100 scrollbar-custom flex-1 flex flex-col rounded-xl border border-gray-100 dark:border-white/5 transition-colors duration-200 ring-0 dark:ring-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <Title className="text-gray-900 dark:text-white flex items-center gap-2">
                            Liste des membres
                        </Title>
                        <Text className="text-gray-500 dark:text-gray-400">
                            Equipe et collaborateurs ayant accès à ce projet.
                        </Text>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={Search}
                                placeholder="Rechercher un membre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white"
                            />
                        </div>
                        <Button icon={Plus} size="sm" className='bg-black hover:bg-black/85 dark:hover:bg-white/85 dark:bg-white border-none cursor-pointer'>
                            Inviter
                        </Button>
                    </div>
                </div>

                <Table className="mt-2">
                    <TableHead>
                        <TableRow className="border-b border-gray-200 dark:border-white/5">
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-left">Utilisateur</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-center">Rôle</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-center">Date d'accès</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-right">Actions</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMembers?.map((member: any) => (
                            <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-default border-b border-gray-100 dark:border-white/5 last:border-none">
                                <TableCell className="font-medium text-gray-900 dark:text-gray-200 text-left">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex flex-col">
                                            <span className="block">{member.user?.firstName} {member.user?.surName}</span>
                                            <span className="text-xs text-gray-500 font-normal">{member.user?.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-400 font-medium text-center">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium dark:bg-white/10 bg-gray-100">
                                        {member.isAdmin && <Shield className="w-3 h-3 text-blue-500" />}
                                        {member.role === 'admin' ? 'Administrateur' : 'Membre'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-400 text-center">
                                    {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('fr-FR') : "N/A"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1 min-w-[88px] min-h-[36px]">
                                        {!member.isAdmin && (
                                            <button className="w-9 h-9 flex items-center justify-center p-2 outline-none focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                title="Retirer le membre"
                                            >
                                                <Trash className='w-5 h-5 text-red-500 hover:text-red-600' />
                                            </button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredMembers?.length === 0 && !isPending && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400 italic">
                        {searchQuery ? "Aucun membre ne correspond à votre recherche." : "Aucun membre trouvé."}
                    </div>
                )}
            </Card>
        </div>
    );
}

export default Members;