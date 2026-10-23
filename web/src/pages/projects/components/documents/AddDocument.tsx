import { useRef, useState } from "react";
import { Button } from "@tremor/react";
import { Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { uploadDocumentToProject } from "../../../../requests/projects";

const ACCEPTED_EXTENSIONS = ["pdf", "docx", "png", "jpg", "jpeg"];
const ACCEPTED_FILES = ACCEPTED_EXTENSIONS.map((extension) => `.${extension}`).join(",");

type AddDocumentProps = {
    projectId: string;
};

const AddDocument = ({ projectId }: AddDocumentProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const { mutate: uploadMutation, isPending } = useMutation({
        mutationFn: (file: File) => uploadDocumentToProject(projectId, file, setProgress),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', projectId, 'documents'] });
            queryClient.invalidateQueries({ queryKey: ['user', 'storage'] });
            toast.success("Document ajouté avec succès !");
        },
        onError: (err: Error) => {
            toast.error(err.message);
        },
        onSettled: () => {
            setProgress(null);
            if (inputRef.current)
                inputRef.current.value = "";
        }
    });

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_FILES}
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file)
                        return;
                    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
                    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
                        toast.error("Formats acceptés : PDF, DOCX, PNG, JPG, JPEG.");
                        e.target.value = "";
                        return;
                    }
                    uploadMutation(file);
                }}
            />
            <Button
                icon={Upload}
                size="sm"
                loading={isPending}
                disabled={isPending}
                className='bg-black hover:bg-black/85 dark:hover:bg-white/85 dark:bg-white border-none cursor-pointer'
                onClick={() => inputRef.current?.click()}
            >
                {isPending ? `Envoi... ${progress ?? 0}%` : "Ajouter un document"}
            </Button>
        </>
    );
}

export default AddDocument;
