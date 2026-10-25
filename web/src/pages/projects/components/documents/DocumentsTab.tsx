import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextInput, Card, Title, Text, ProgressBar } from '@tremor/react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Search, Trash, X, Check, Download, Eye, FileText, FileImage, File } from "lucide-react";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import LoadingPrimoLogo from "../../../../components/animations/LoadingPrimoLogo";
import { deleteDocumentFromProject, getDocumentDownloadUrl, getDocumentsOfProject, getStorageUsage } from "../../../../requests/projects";
import type { ProjectDocument } from "../../../../types/project/documents";
import AddDocument from './AddDocument';
import DocumentViewer from './DocumentViewer';

const formatSize = (size: number) => {
    if (size < 1024)
        return `${size} o`;
    if (size < 1024 * 1024)
        return `${(size / 1024).toFixed(1)} Ko`;
    if (size < 1024 * 1024 * 1024)
        return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} Go`;
};

const DocumentIcon = ({ documentType }: { documentType: string }) => {
    const className = "w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0";
    if (documentType === "image")
        return <FileImage className={className} />;
    if (documentType === "pdf" || documentType === "document")
        return <FileText className={className} />;
    return <File className={className} />;
};

const DocumentsTab = () => {
    const { projectId } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [viewedDocument, setViewedDocument] = useState<ProjectDocument | null>(null);
    const queryClient = useQueryClient();

    const { data: documents, isPending } = useQuery({
        queryKey: ['project', projectId, 'documents'],
        queryFn: () => getDocumentsOfProject(projectId!),
        enabled: !!projectId,
    });

    const { data: storageUsage } = useQuery({
        queryKey: ['user', 'storage'],
        queryFn: getStorageUsage,
    });

    const storagePercent = storageUsage ? Math.min(100, (storageUsage.used / storageUsage.quota) * 100) : 0;

    const { mutate: deleteDocumentMutation } = useMutation({
        mutationFn: (documentId: string) => deleteDocumentFromProject(projectId!, documentId),
        onSuccess: () => {
            setIdToDelete(null);
            queryClient.invalidateQueries({ queryKey: ['project', projectId, 'documents'] });
            queryClient.invalidateQueries({ queryKey: ['user', 'storage'] });
            toast.success("Document supprimé avec succès !");
        },
        onError: (err: Error) => {
            setIdToDelete(null);
            toast.error(err.message);
        }
    });

    const downloadDocument = async (documentId: string) => {
        try {
            const url = await getDocumentDownloadUrl(projectId!, documentId);
            window.open(url, "_blank", "noopener,noreferrer");
        } catch (err) {
            toast.error((err as Error).message);
        }
    };

    const filteredDocuments = documents?.filter((document: ProjectDocument) =>
        document.documentName.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Card className="w-full h-80/100 scrollbar-custom flex-1 flex flex-col rounded-xl border border-gray-100 dark:border-white/5 transition-colors duration-200 ring-0 dark:ring-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <Title className="text-gray-900 dark:text-white flex items-center gap-2">
                            Documents du projet
                        </Title>
                        <Text className="text-gray-500 dark:text-gray-400">
                            Fichiers partagés avec les membres du projet (PDF, DOCX, PNG, JPG · 20 Mo max).
                        </Text>
                        {storageUsage && (
                            <div className="mt-3 w-full sm:w-72">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span>Votre stockage</span>
                                    <span>{formatSize(storageUsage.used)} / {formatSize(storageUsage.quota)}</span>
                                </div>
                                <ProgressBar value={storagePercent} color={storagePercent >= 90 ? "red" : "gray"} />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={Search}
                                placeholder="Rechercher un document..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white"
                            />
                        </div>
                        <AddDocument projectId={projectId!} />
                    </div>
                </div>

                <Table className="mt-2">
                    <TableHead>
                        <TableRow className="border-b border-gray-200 dark:border-white/5">
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-left">Nom</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-center">Taille</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-center">Ajouté le</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400 text-right">Actions</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDocuments?.map((document: ProjectDocument) => (
                            <TableRow key={document.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-default border-b border-gray-100 dark:border-white/5 last:border-none">
                                <TableCell className="font-medium text-gray-900 dark:text-gray-200 text-left">
                                    <button className="flex items-center gap-3 cursor-pointer hover:underline text-left"
                                        onClick={() => setViewedDocument(document)}
                                        title={`Ouvrir ${document.documentName}`}
                                    >
                                        <DocumentIcon documentType={document.documentType} />
                                        <span className="truncate max-w-[400px]">{document.documentName}</span>
                                    </button>
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-400 text-center">
                                    {formatSize(document.size)}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-400 text-center">
                                    {new Date(document.createdAt).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1 min-w-[124px] min-h-[36px]">
                                        {idToDelete === document.id ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-300 hover:text-white transition-colors hover:border-none cursor-pointer border border-gray-400 text-gray-400"
                                                    onClick={() => setIdToDelete(null)}
                                                    title="Annuler"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-colors cursor-pointer text-white"
                                                    onClick={() => deleteDocumentMutation(document.id)}
                                                    title="Confirmer la suppression"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button className="w-9 h-9 flex cursor-pointer items-center justify-center p-2 outline-none focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                                                    onClick={() => setViewedDocument(document)}
                                                    title="Aperçu"
                                                >
                                                    <Eye className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                                                </button>
                                                <button className="w-9 h-9 flex cursor-pointer items-center justify-center p-2 outline-none focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                                                    onClick={() => downloadDocument(document.id)}
                                                    title="Télécharger"
                                                >
                                                    <Download className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                                                </button>
                                                <button className="w-9 h-9 flex cursor-pointer items-center justify-center p-2 outline-none focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                                                    onClick={() => setIdToDelete(document.id)}
                                                    title="Supprimer le document"
                                                >
                                                    <Trash className='w-5 h-5 text-red-700' />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredDocuments?.length === 0 && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400 italic">
                        {searchQuery ? "Aucun document ne correspond à votre recherche." : "Aucun document pour le moment."}
                    </div>
                )}
            </Card>
            {viewedDocument &&
                <DocumentViewer
                    projectId={projectId!}
                    document={viewedDocument}
                    onClose={() => setViewedDocument(null)}
                    onDownload={() => downloadDocument(viewedDocument.id)}
                />
            }
        </div>
    );
}

export default DocumentsTab;
