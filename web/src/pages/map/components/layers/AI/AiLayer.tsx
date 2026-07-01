import { useState, useRef } from "react";
import { Send, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { aiStreamRequest } from "../../../../../requests/ai";
import ModalRedirectAiCoordinates from "./ModalRedirectAiCoordinates";

type HistoryItem = {
    question: string;
    who: "ai" | "user";
}

type StreamPayload = {
    text: string;
    done: boolean;
    error?: string;
};

const AiLayer = () => {
    const [inputValue, setInputValue] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [coordinates, setCoordinates] = useState("");
    const [isFinished, setIsFinished] = useState(false);

    const sseBufferRef = useRef("");
    const streamingCoords = useRef("");
    const isJsonFinishedRef = useRef(false);

    const handleContent = (content: string) => {
        if (!content) return;

        // Étape 1 : On intercepte le début du stream pour reconstruire le JSON
        if (!isJsonFinishedRef.current) {
            streamingCoords.current += content;

            // Si on détecte le séparateur
            if (streamingCoords.current.includes("---")) {
                const parts = streamingCoords.current.split("---");
                const jsonPart = parts[0];
                // On récupère tout ce qui se trouve après le séparateur (au cas où il y aurait du texte dans le même chunk)
                const textPart = parts.slice(1).join("---").trimStart();

                isJsonFinishedRef.current = true;
                setCoordinates(jsonPart);
                setIsFinished(true);

                // Si l'IA a déjà commencé à parler après le séparateur, on l'ajoute à l'historique
                if (textPart) {
                    setHistory((prev) => {
                        const newHistory = [...prev];
                        const lastIndex = newHistory.length - 1;
                        if (lastIndex >= 0 && newHistory[lastIndex].who === "ai") {
                            newHistory[lastIndex] = {
                                ...newHistory[lastIndex],
                                question: newHistory[lastIndex].question + textPart
                            };
                        }
                        return newHistory;
                    });
                }
            }
        } else {
            // Étape 2 : Le JSON est passé, on stream le texte normalement dans le chat
            setHistory((prev) => {
                const newHistory = [...prev];
                const lastIndex = newHistory.length - 1;

                if (lastIndex >= 0 && newHistory[lastIndex].who === "ai") {
                    newHistory[lastIndex] = {
                        ...newHistory[lastIndex],
                        question: newHistory[lastIndex].question + content
                    };
                }
                return newHistory;
            });
        }
    };

    const onResponseChunk = (chunk: string) => {
        sseBufferRef.current += chunk;

        const parts = sseBufferRef.current.split("\n\n");
        sseBufferRef.current = parts.pop() ?? "";

        for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;

            const jsonStr = line.slice(5).trim();
            if (!jsonStr) continue;

            try {
                const payload: StreamPayload = JSON.parse(jsonStr);

                if (payload.error) {
                    console.error("Erreur de stream reçue du back:", payload.error);
                    setIsDisabled(false);
                    continue;
                }

                if (payload.done) {
                    setIsDisabled(false);
                    continue;
                }

                handleContent(payload.text);
            } catch (e) {
                console.error("Chunk SSE invalide, ignoré:", jsonStr, e);
            }
        }
    };

    const { mutate: mutateAiRequest } = useMutation({
        mutationFn: (prompt: string) => aiStreamRequest(prompt, onResponseChunk),
        onSuccess: () => {
            setIsDisabled(false);
            sseBufferRef.current = "";
        },
        onError: () => {
            setIsDisabled(false);
            sseBufferRef.current = "";
            // En cas d'erreur, s'assurer qu'on ne reste pas bloqué
            isJsonFinishedRef.current = false;
            streamingCoords.current = "";
        }
    });

    const handleSend = () => {
        if (inputValue.trim() === "" || isDisabled) return;

        const currentInput = inputValue;

        // Reset des états et des refs pour la nouvelle requête
        setIsFinished(false);
        setCoordinates("");
        isJsonFinishedRef.current = false;
        streamingCoords.current = "";

        setHistory((prev) => [...prev, { question: currentInput, who: "user" }, { question: "", who: "ai" }]);
        setInputValue("");
        setIsDisabled(true);

        mutateAiRequest(currentInput);
    };

    const handleCloseModal = () => {
        setCoordinates("");
        setIsFinished(false);
    };

    const hasFoundCoordinates = () => {
        if (!coordinates) return false;
        try {
            const parsed = JSON.parse(coordinates);
            return parsed.found === true;
        } catch (e) {
            console.error("Le JSON généré par l'IA est mal formé:", e);
            return false;
        }
    };

    return (
        <div className={`absolute z-400 right-13 -bottom-63 bg-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden w-80 h-120`}>
            <div className="w-full h-full flex flex-col font-UberMoveMedium text-gray-600">
                <div className="w-full p-2 flex items-center justify-end">
                    <button className="cursor-pointer hover:scale-105 duration-200">
                        <X />
                    </button>
                </div>
                <div className="w-full h-[1px] bg-gray-200" />
                <div className="w-full h-full pr-2 pl-2 overflow-hidden">
                    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
                        {history.map((item, index) => (
                            <div key={index} className={`w-full p-1 flex ${item.who === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`w-max max-w-[80%] p-2 rounded-lg break-words ${item.who === "user" ? "bg-[#388160] text-white" : "bg-gray-200 text-gray-700"}`}>
                                    {item.question}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full h-[1px] bg-gray-200" />
                <div className="w-full p-3 flex flex-row gap-2 items-center justify-between">
                    <textarea
                        className="disabled:cursor-not-allowed w-full h-12 border border-gray-200 focus:outline-none p-1 pl-2 pr-2 rounded-lg resize-none"
                        placeholder="Demander à l'IA..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isDisabled}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <button
                        className="disabled:cursor-not-allowed w-7 h-7 aspect-square rounded-full bg-[#388160] flex items-center justify-center cursor-pointer disabled:opacity-50"
                        onClick={handleSend}
                        disabled={isDisabled}
                    >
                        <Send size={20} className="mt-0.5 mr-1 text-white" />
                    </button>
                </div>
            </div>

            {/* Rendu conditionnel et sécurisé de la modale */}
            {isFinished && hasFoundCoordinates() && (
                <ModalRedirectAiCoordinates coordinates={coordinates} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default AiLayer;