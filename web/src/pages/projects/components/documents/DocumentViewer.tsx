import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { Download, X } from "lucide-react";
import LoadingPrimoLogo from "../../../../components/animations/LoadingPrimoLogo";
import { getDocumentViewUrl } from "../../../../requests/projects";
import type { ProjectDocument } from "../../../../types/project/documents";

type DocumentViewerProps = {
    projectId: string;
    document: ProjectDocument;
    onClose: () => void;
    onDownload: () => void;
};

const ViewerMessage = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-full h-full text-gray-500 dark:text-gray-400 italic">
        {children}
    </div>
);

const DocxViewer = ({ url }: { url: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        let cancelled = false;

        const render = async () => {
            try {
                const [{ renderAsync }, response] = await Promise.all([
                    import("docx-preview"),
                    fetch(url),
                ]);
                if (!response.ok)
                    throw new Error();
                const blob = await response.blob();
                if (cancelled || !containerRef.current)
                    return;
                containerRef.current.innerHTML = "";
                await renderAsync(blob, containerRef.current, undefined, { inWrapper: true });
                if (!cancelled)
                    setStatus("ready");
            } catch {
                if (!cancelled)
                    setStatus("error");
            }
        };

        render();
        return () => {
            cancelled = true;
        };
    }, [url]);

    return (
        <div className="relative w-full h-full overflow-auto scrollbar-custom">
            {status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
                </div>
            )}
            {status === "error" && <ViewerMessage>Impossible d'afficher ce document.</ViewerMessage>}
            <div ref={containerRef} className={status === "ready" ? "" : "hidden"} />
        </div>
    );
};

const DocumentViewer = ({ projectId, document, onClose, onDownload }: DocumentViewerProps) => {
    const { data: url, isPending, isError } = useQuery({
        queryKey: ['project', projectId, 'documents', document.id, 'view'],
        queryFn: () => getDocumentViewUrl(projectId, document.id),
        gcTime: 0,
        staleTime: 0,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const renderContent = () => {
        if (isPending)
            return (
                <div className="flex items-center justify-center w-full h-full">
                    <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
                </div>
            );
        if (isError || !url)
            return <ViewerMessage>Impossible de charger le document.</ViewerMessage>;

        switch (document.documentType) {
            case "image":
                return (
                    <div className="flex items-center justify-center w-full h-full p-4">
                        <img src={url} alt={document.documentName} className="max-w-full max-h-full object-contain rounded-md" />
                    </div>
                );
            case "pdf":
                return <iframe src={url} title={document.documentName} className="w-full h-full border-none" />;
            case "document":
                return <DocxViewer url={url} />;
            default:
                return <ViewerMessage>Aperçu indisponible pour ce type de fichier.</ViewerMessage>;
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-6" onClick={onClose}>
            <div
                className="flex flex-col w-full max-w-6xl h-full bg-white dark:bg-[#171717] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-white/5">
                    <span className="font-medium text-gray-900 dark:text-white truncate" title={document.documentName}>
                        {document.documentName}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                        <button className="w-9 h-9 flex cursor-pointer items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            onClick={onDownload}
                            title="Télécharger"
                        >
                            <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button className="w-9 h-9 flex cursor-pointer items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            onClick={onClose}
                            title="Fermer"
                        >
                            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 min-h-0 bg-gray-100 dark:bg-[#0A0A0A]">
                    {renderContent()}
                </div>
            </div>
        </div>,
        window.document.body
    );
};

export default DocumentViewer;
