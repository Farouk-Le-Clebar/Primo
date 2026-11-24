import { NavLink } from "react-router-dom";
import { LayoutGroup, motion } from "framer-motion";
import { useProjectNews } from "../../../../../hooks/useProjectNews";

type ActivityKind = "plot" | "note" | "document" | "member" | "milestone";

const TABS: { path: string; label: string; kind?: ActivityKind }[] = [
  { path: "dashboard", label: "Vue d’ensemble" },
  { path: "plots", label: "Parcelles", kind: "plot" },
  { path: "members", label: "Membres", kind: "member" },
  { path: "documents", label: "Documents", kind: "document" },
  { path: "notes", label: "Notes", kind: "note" },
  { path: "milestones", label: "Jalons", kind: "milestone" },
  { path: "addresses", label: "Adresses" },
];

export default function ProjectTabs({ projectId }: { projectId: string }) {
  const { unreadByKind } = useProjectNews(projectId);

  return (
    <LayoutGroup id="project-tabs">
      <nav data-tour="project-tabs" className="scrollbar-none -mx-4 mt-5 flex gap-6 overflow-x-auto border-b px-4 whitespace-nowrap md:mx-0 md:px-0 border-[#1c1c1e]/8 dark:border-white/10">
        {TABS.map(({ path, label, kind }) => {
          const unread = kind ? unreadByKind[kind] ?? 0 : 0;
          return (
            <NavLink key={path} to={path} data-tour={`project-tab-${path}`} className="group relative flex flex-col gap-2.5">
              {({ isActive }) => (
                <>
                  <span className={`flex items-center gap-1.5 text-sm transition-colors ${isActive ? "font-semibold text-[#1c1c1e] dark:text-[#fafafa]" : "font-medium text-[#82828c] group-hover:text-[#1c1c1e] dark:group-hover:text-white"}`}>
                    {label}
                    {unread > 0 && <span className="rounded-full bg-red-500/12 px-1.5 py-px text-[10px] font-bold text-red-500 dark:bg-red-500/20">{unread}</span>}
                  </span>
                  {isActive ? (
                    <motion.span layoutId="tab-underline" transition={{ type: "spring", stiffness: 500, damping: 38 }} className="h-0.5 w-full bg-[#1c1c1e] dark:bg-[#fafafa]" />
                  ) : (
                    <span className="h-0.5 w-full origin-left scale-x-0 bg-[#1c1c1e]/20 transition-transform duration-200 group-hover:scale-x-100 dark:bg-white/20" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </LayoutGroup>
  );
}
