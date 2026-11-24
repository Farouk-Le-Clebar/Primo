import { useState } from "react";
import { TextInput } from "@tremor/react";
import { MapPin } from "lucide-react";
import { useAddokSuggestions, type AddressSuggestion } from "../../hooks/useAddokSuggestions";

type AddressAutocompleteProps = {
    selected: AddressSuggestion | null;
    onSelect: (suggestion: AddressSuggestion | null) => void;
};

const AddressAutocomplete = ({ selected, onSelect }: AddressAutocompleteProps) => {
    const [query, setQuery] = useState("");
    const { suggestions, isLoading } = useAddokSuggestions(selected ? "" : query);
    const showSuggestions = !selected && query.trim().length >= 3;

    const handleChange = (value: string) => {
        setQuery(value);
        if (selected) onSelect(null);
    };

    const handleSelect = (suggestion: AddressSuggestion) => {
        setQuery(suggestion.label);
        onSelect(suggestion);
    };

    return (
        <div>
            <TextInput
                value={query}
                onValueChange={handleChange}
                placeholder="Rechercher une adresse..."
                icon={MapPin}
                className="dark:bg-[#0A0A0A] dark:border-white/10"
            />
            {showSuggestions && (
                <ul className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-100 dark:border-white/10">
                    {isLoading && <li className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">Recherche...</li>}
                    {!isLoading && suggestions.length === 0 && (
                        <li className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">Aucune adresse trouvée</li>
                    )}
                    {!isLoading && suggestions.map((suggestion) => (
                        <li key={suggestion.key}>
                            <button
                                type="button"
                                onClick={() => handleSelect(suggestion)}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 cursor-pointer"
                            >
                                {suggestion.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressAutocomplete;
