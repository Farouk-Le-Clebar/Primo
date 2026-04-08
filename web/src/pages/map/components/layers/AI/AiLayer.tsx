import { useState, useRef } from "react";
import LogoAi from "../../../../../assets/logos/LogoAI.svg?react";
import { Send, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { aiStreamRequest } from "../../../../../requests/ai";
import ModalRedirectAiCoordinates from "./ModalRedirectAiCoordinates";

type HistoryItem = {
    question: string;
    who: "ai" | "user";
}

const AiLayer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [coordinates, setCoordinates] = useState("");
    const [isFinished, setIsFinished] = useState(false);

    const streamingCoords = useRef("");
    const isJsonFinishedRef = useRef(false);

    const onResponseChunk = (chunk: string) => {
        const lines = chunk.split("\n");

        for (const line of lines) {
            if (!line.trim()) continue;

            try {
                const json_chunk = JSON.parse(line);
                const content = json_chunk.response || "";

                if (!isJsonFinishedRef.current) {
                    streamingCoords.current += content;
                    if (streamingCoords.current.includes("---")) {
                        const [coords] = streamingCoords.current.split("---");

                        isJsonFinishedRef.current = true;
                        setCoordinates(coords);
                        setIsFinished(true);
                    } else {
                        setCoordinates(streamingCoords.current);
                    }
                } else {
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
            } catch (e) {
                console.error(e);
            }
        }
    };

    const { mutate: mutateAiRequest } = useMutation({
        mutationFn: (prompt: string) => aiStreamRequest(prompt, onResponseChunk),
        onSuccess: () => {
            setIsDisabled(false);
            isJsonFinishedRef.current = false;
            streamingCoords.current = "";
        },
        onError: () => {
            setIsDisabled(false);
        }
    });

    const handleSend = () => {
        if (inputValue.trim() === "" || isDisabled) return;

        const currentInput = inputValue;
        setIsFinished(false);
        setCoordinates("");
        setHistory((prev) => [...prev, { question: currentInput, who: "user" }, { question: "", who: "ai" }]);
        setInputValue("");
        setIsDisabled(true);
        mutateAiRequest(currentInput);
    };

    const handleCloseModal = () => {
        setCoordinates("");
        setIsFinished(false);
    };

    return (
        <div className={`absolute z-400 top-20 right-4 bg-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden ${isOpen ? "w-80 h-120" : "w-35 h-10"}`}>
            {!isOpen ? (
                <button
                    className="w-full h-full cursor-pointer hover:scale-105 duration-200 flex flex-row items-center justify-center gap-1 text-gray-700"
                    onClick={() => setIsOpen(true)}
                >
                    <p className="font-UberMoveMedium text-sm">Demander a </p>
                    <LogoAi className="w-7 h-7 mb-1" />
                </button>
            ) : (
                <div className="w-full h-full flex flex-col font-UberMoveMedium text-gray-600">
                    <div className="w-full p-2 flex items-center justify-end">
                        <button
                            className="cursor-pointer hover:scale-105 duration-200"
                            onClick={() => setIsOpen(false)}
                        >
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
            )}
            {isFinished && coordinates !== "" && JSON.parse(coordinates).found && (
                <ModalRedirectAiCoordinates coordinates={coordinates} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default AiLayer;