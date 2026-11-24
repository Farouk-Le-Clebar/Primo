import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText } from "lucide-react";
import Modal from "../../../../ui/Modal";
import ModalButton from "../../../../ui/ModalButton";
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

    return (
        <Modal
            title={document.documentName}
            subtitle="Aperçu du document"
            icon={FileText}
            size="xl"
            bodyClassName="h-[72vh] px-0! pb-0!"
            onClose={onClose}
            footer={
                <>
                    <ModalButton variant="secondary" onClick={onClose}>Fermer</ModalButton>
                    <ModalButton icon={Download} onClick={onDownload}>Télécharger</ModalButton>
                </>
            }
        >
            <div className="h-full bg-[#1c1c1e]/4 dark:bg-black/30">{renderContent()}</div>
        </Modal>
    );
};

export default DocumentViewer;
