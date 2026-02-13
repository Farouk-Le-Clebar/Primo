import React from "react";

type ListViewProps = {
    itemCount?: number;
};

const ListView: React.FC<ListViewProps> = ({ itemCount = 8 }) => {
    return (
        <div className="w-full h-full overflow-y-auto">
            <div className="divide-y divide-gray-200">
                {Array.from({ length: itemCount }).map((_, index) => (
                    <div
                        key={index}
                        className="py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded animate-pulse w-2/3 group-hover:bg-gray-400 transition-colors" />
                            </div>
                            
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 group-hover:bg-gray-300 transition-colors" />
                            </div>
                            
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5 group-hover:bg-gray-300 transition-colors" />
                            </div>

                             <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/5 group-hover:bg-gray-300 transition-colors" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListView;