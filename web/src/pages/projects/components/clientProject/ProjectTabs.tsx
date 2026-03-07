import React, { useRef, useEffect, useState } from "react";
import { PROJECT_TABS } from "../../../../constants/project.constants";
import type { TabKey } from "../../../../types/projectTab";

type ProjectTabsProps = {
    activeTab: TabKey;
    onTabChange: (tab: TabKey) => void;
};

const ProjectTabs: React.FC<ProjectTabsProps> = ({
    activeTab,
    onTabChange,
}) => {
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [indicator, setIndicator] = useState({ left: 0, width: 0 });

    useEffect(() => {
        const el = tabRefs.current[activeTab];
        if (el) {
            const textEl = el.querySelector("span");
            if (textEl) {
                const textWidth = textEl.offsetWidth;
                const barWidth = textWidth * 0.8;
                const textLeft =
                    textEl.getBoundingClientRect().left -
                    (el.closest("[data-tab-container]")?.getBoundingClientRect()
                        .left ?? 0);
                const barLeft = textLeft + (textWidth - barWidth) / 2;
                setIndicator({ left: barLeft, width: barWidth });
            }
        }
    }, [activeTab]);

    return (
        <div data-tab-container className="relative flex items-center gap-6">
            {PROJECT_TABS.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                    <button
                        key={tab.key}
                        ref={(el) => {
                            tabRefs.current[tab.key] = el;
                        }}
                        onClick={() => onTabChange(tab.key)}
                        className={`relative pb-3 pt-1 cursor-pointer transition-colors bg-transparent border-none outline-none ${
                            isActive
                                ? "text-black"
                                : "text-[#949496] hover:text-gray-700"
                        }`}
                    >
                        <span className="text-sm font-medium whitespace-nowrap">
                            {tab.label}
                        </span>
                    </button>
                );
            })}

            {/* Active indicator bar */}
            <div
                className="absolute mt-5 h-[2px] bg-black rounded-full transition-all duration-300 ease-in-out"
                style={{
                    left: indicator.left,
                    width: indicator.width,
                }}
            />
        </div>
    );
};

export default ProjectTabs;
