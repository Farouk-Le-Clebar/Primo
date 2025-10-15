import { useState, useEffect } from "react";
import { addOkRequest } from "../../request/addok";
import { useMutation } from "@tanstack/react-query";

const SearchingBar = () => {
    const [address, setAddress] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<string[]>([]);
    const [debouncedAddress, setDebouncedAddress] = useState(address);

    const { mutate: getAddress } = useMutation({
        mutationFn: (address: string) => addOkRequest(address),
        onSuccess: (data: any) => {
            setSelectedAddress([]);
            data.features.forEach((feature: any) => {
                setSelectedAddress((prev) => [...prev, feature.properties.label]);
            });
        },
        onError: () => {
            setSelectedAddress([]);
        }
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedAddress(address);
        }, 250);

        return () => {
            clearTimeout(handler);
        };
    }, [address]);

    useEffect(() => {
        if (debouncedAddress.trim() !== "") {
            getAddress(debouncedAddress);
        } else {
            setSelectedAddress([]);
        }
    }, [debouncedAddress]);

    return (
        <div className="relative w-screen h-screen flex justify-center items-center">
            <div className="w-150">
                <input
                    className="w-full rounded-xl h-10 p-2 border border-gray-400 focus:outline-none"
                    type="text"
                    placeholder="Rechercher une adresse..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                {selectedAddress.length > 0 && (
                    <div className="absolute w-150 flex flex-col border border-gray-300 rounded-xl bg-white mt-1">
                        {selectedAddress.map((address) => (
                            <button
                                key={address}
                                className="h-10 text-left p-2 hover:bg-gray-200 rounded-xl cursor-pointer"
                                onClick={() => {
                                    setAddress(address);
                                    setSelectedAddress([]);
                                }}
                            >
                                {address}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
}

export default SearchingBar;
