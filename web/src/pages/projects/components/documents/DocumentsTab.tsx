const DocumentsTab = () => {
    return (
        <div className="flex flex-1 flex-col justify-center px-6 py-16">
            <p className="text-[11px] font-medium tracking-[0.12em] text-gray-400 uppercase">Documents</p>
            <p className="mt-2 max-w-sm text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                Aucun document rattaché à ce projet pour l'instant.
            </p>
        </div>
    );
}

export default DocumentsTab;
