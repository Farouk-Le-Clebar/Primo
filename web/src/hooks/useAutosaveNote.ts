import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { updateProjectNote, updateProjectNoteOnUnload } from "../requests/notes";
import type { ProjectNote } from "../types/project/notes";

export type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error" | "conflict";

const AUTOSAVE_DELAY_MS = 1000;

// Debounced autosave of one note. The editor is expected to be remounted (key = note.id) when the note changes.
export function useAutosaveNote(note: ProjectNote, onSaved: (note: ProjectNote) => void) {
    const [title, setTitleState] = useState(note.title);
    const [content, setContentState] = useState(note.content);
    const [status, setStatus] = useState<SaveStatus>("idle");
    const [serverNote, setServerNote] = useState<ProjectNote | null>(null);

    const draft = useRef({ title: note.title, content: note.content });
    const version = useRef(note.version);
    const dirty = useRef(false);
    const inFlight = useRef(false);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const conflicted = useRef(false);
    const onSavedRef = useRef(onSaved);
    onSavedRef.current = onSaved;

    const save = useCallback(async () => {
        clearTimeout(timer.current);
        timer.current = undefined;
        if (!dirty.current || conflicted.current)
            return;
        if (inFlight.current)
            return; // The running save re-checks `dirty` once it is done.

        inFlight.current = true;
        dirty.current = false;
        setStatus("saving");
        try {
            const saved = await updateProjectNote(note.projectId, note.id, { ...draft.current, version: version.current });
            version.current = saved.version;
            onSavedRef.current(saved);
            setStatus(dirty.current ? "dirty" : "saved");
        } catch (error) {
            dirty.current = true;
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                conflicted.current = true;
                setServerNote(error.response.data?.note ?? null);
                setStatus("conflict");
            } else {
                setStatus("error");
            }
        } finally {
            inFlight.current = false;
        }
        if (dirty.current && !conflicted.current && !timer.current)
            timer.current = setTimeout(save, AUTOSAVE_DELAY_MS);
    }, [note.id, note.projectId]);

    const schedule = useCallback(() => {
        dirty.current = true;
        setStatus((current) => (current === "conflict" ? current : "dirty"));
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            timer.current = undefined;
            void save();
        }, AUTOSAVE_DELAY_MS);
    }, [save]);

    const setTitle = (value: string) => {
        draft.current.title = value;
        setTitleState(value);
        schedule();
    };

    const setContent = (value: string) => {
        draft.current.content = value;
        setContentState(value);
        schedule();
    };

    // Conflict: keep the other member's version, or overwrite it with the local draft.
    const acceptServerVersion = () => {
        if (!serverNote)
            return;
        draft.current = { title: serverNote.title, content: serverNote.content };
        version.current = serverNote.version;
        setTitleState(serverNote.title);
        setContentState(serverNote.content);
        dirty.current = false;
        conflicted.current = false;
        setServerNote(null);
        setStatus("saved");
        onSavedRef.current(serverNote);
    };

    const overwriteWithMine = () => {
        if (serverNote)
            version.current = serverNote.version;
        conflicted.current = false;
        setServerNote(null);
        dirty.current = true;
        void save();
    };

    // Flush pending edits when the editor closes (note switch, tab change) or the page is closed.
    useEffect(() => {
        const onBeforeUnload = () => {
            if (dirty.current && !conflicted.current)
                updateProjectNoteOnUnload(note.projectId, note.id, { ...draft.current, version: version.current });
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            if (dirty.current && !conflicted.current)
                void save();
        };
    }, [note.id, note.projectId, save]);

    return { title, content, setTitle, setContent, status, serverNote, acceptServerVersion, overwriteWithMine, retry: save };
}
