import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@tremor/react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  FolderOpen,
  Loader2,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import type { ProjectResponse } from "../../types/project/projects";
import {
  deleteProject,
  getProjects,
  toggleFavorite,
} from "../../requests/projects";
import CreateProjectModal from "./CreateProjectModal";

type Project = ProjectResponse & { numberOfMembers?: number };
const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50";
const iconButton =
  "rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:hover:bg-white/5 dark:hover:text-white disabled:opacity-50";
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr-FR");
const dateValue = (value: string) =>
  Number.isFinite(Date.parse(value)) ? Date.parse(value) : 0;

export default function Projects() {
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState("recent");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const queryClient = useQueryClient();
  const {
    data: projects = [],
    isPending,
    isError,
    refetch,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
    refetchOnWindowFocus: false,
  });
  const favorite = useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    onError: () => toast.error("Impossible de modifier ce favori. Réessayez."),
  });
  const removal = useMutation({
    mutationFn: deleteProject,
    onSuccess: async (_, id) => {
      setDeleting(null);
      toast.success("Projet supprimé.");
      queryClient.removeQueries({ queryKey: ["project", id] });
      queryClient.removeQueries({ queryKey: ["projectPlots", id] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () =>
      toast.error(
        "Impossible de supprimer ce projet. Vérifiez vos droits et réessayez.",
      ),
  });
  const favoritesCount = projects.filter(
    (project) => project.isFavorite,
  ).length;
  const query = normalize(search.trim());
  const visibleProjects = projects
    .filter(
      (project) =>
        (!favoritesOnly || project.isFavorite) &&
        normalize(`${project.name} ${project.description || ""}`).includes(
          query,
        ),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "fr")
        : dateValue(b.createdAt) - dateValue(a.createdAt),
    );

  return (
    <div className="w-full px-4 pb-6 font-inter sm:px-6">
      <Card className="mb-6 rounded-xl border-gray-200 bg-white p-5 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Votre espace de travail
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Projets
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Un espace pour chaque recherche. Vos parcelles, vos notes et votre
              équipe, réunies.
            </p>
          </div>
          <button onClick={() => setCreating(true)} className={primaryButton}>
            <Plus size={16} />
            Créer un projet
          </button>
        </div>
        {!isPending && !isError && projects.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-white/5 dark:text-gray-400">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">
                {projects.length}
              </strong>{" "}
              projet{projects.length !== 1 ? "s" : ""}
            </span>
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">
                {projects.reduce(
                  (sum, project) => sum + project.numberOfPlots,
                  0,
                )}
              </strong>{" "}
              parcelles enregistrées dans vos projets
            </span>
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">
                {favoritesCount}
              </strong>{" "}
              favori{favoritesCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </Card>

      {!isPending && !isError && projects.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-white/5"
            aria-label="Filtrer les projets"
          >
            {[
              { label: "Tous les projets", value: false },
              { label: "Favoris", value: true },
            ].map((filter) => (
              <button
                key={filter.label}
                onClick={() => setFavoritesOnly(filter.value)}
                aria-pressed={favoritesOnly === filter.value}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 ${favoritesOnly === filter.value ? "bg-white text-gray-900 shadow-sm dark:bg-[#262626] dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="relative min-w-0 flex-1 sm:w-64">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                aria-label="Rechercher un projet"
                placeholder="Rechercher un projet…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-emerald-600 dark:border-white/10 dark:bg-[#171717] dark:text-white"
              />
            </div>
            <select
              aria-label="Trier les projets"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 outline-emerald-600 dark:border-white/10 dark:bg-[#171717] dark:text-gray-300"
            >
              <option value="recent">Plus récents</option>
              <option value="name">Nom : A → Z</option>
            </select>
          </div>
        </div>
      )}

      {isPending ? (
        <div role="status" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <span className="sr-only">Chargement des projets</span>
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="h-60 animate-pulse rounded-xl bg-gray-100 motion-reduce:animate-none dark:bg-white/5"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-500 dark:border-white/10">
          <p>Vos projets sont momentanément indisponibles.</p>
          <button
            onClick={() => void refetch()}
            className="mt-3 text-emerald-700 underline dark:text-emerald-400"
          >
            Réessayer
          </button>
        </div>
      ) : !visibleProjects.length ? (
        <Card className="flex flex-col items-center rounded-xl border-gray-200 bg-white px-6 py-12 text-center shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]">
          <FolderOpen size={28} className="mb-4 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {!projects.length
              ? "Votre prochain projet commence ici"
              : "Aucun projet à afficher"}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
            {!projects.length
              ? "Créez votre premier espace pour sauvegarder des parcelles et avancer avec votre équipe."
              : search
                ? "Essayez un autre nom ou une autre description."
                : "Ajoutez une étoile à un projet pour le retrouver ici."}
          </p>
          {!projects.length ? (
            <button
              onClick={() => setCreating(true)}
              className={`${primaryButton} mt-6`}
            >
              <Plus size={16} />
              Créer mon premier projet
            </button>
          ) : (
            <button
              onClick={() => {
                setSearch("");
                setFavoritesOnly(false);
              }}
              className="mt-5 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Afficher tous les projets
            </button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <Card
              key={project.id}
              className="group flex min-w-0 flex-col rounded-xl border-gray-200 p-0 shadow-sm ring-0 transition-shadow duration-200 hover:shadow-md dark:border-white/10 dark:bg-[#171717]"
            >
              <div className="flex items-center justify-between px-5 pt-5">
                <div className="rounded-lg bg-gray-50 p-2.5 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                  <FolderOpen size={20} />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    aria-label={`${project.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"} : ${project.name}`}
                    aria-pressed={project.isFavorite}
                    disabled={favorite.isPending}
                    onClick={() => favorite.mutate(project.id)}
                    className={iconButton}
                  >
                    {favorite.isPending && favorite.variables === project.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Star
                        size={16}
                        className={
                          project.isFavorite
                            ? "fill-current text-emerald-600 dark:text-emerald-400"
                            : ""
                        }
                      />
                    )}
                  </button>
                  <Menu>
                    <MenuButton
                      aria-label={`Actions du projet ${project.name}`}
                      className={iconButton}
                    >
                      <MoreHorizontal size={18} />
                    </MenuButton>
                    <MenuItems
                      anchor="bottom end"
                      className="z-[100] min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg outline-none dark:border-white/10 dark:bg-[#171717]"
                    >
                      <MenuItem>
                        <button
                          onClick={() => setDeleting(project)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-red-600 data-[focus]:bg-red-50 dark:text-red-400 dark:data-[focus]:bg-red-950/30"
                        >
                          <Trash2 size={14} />
                          Supprimer le projet
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </div>
              <Link
                to={`/projects/${project.id}/dashboard`}
                className="flex flex-1 flex-col px-5 pb-5 pt-4 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-emerald-600"
              >
                <h2
                  className="line-clamp-2 break-words text-base font-semibold tracking-tight text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400"
                  title={project.name}
                >
                  {project.name}
                </h2>
                <p className="mt-2 line-clamp-2 min-h-10 break-words text-xs leading-5 text-gray-500 dark:text-gray-400">
                  {project.description ||
                    "Un espace pour rassembler vos prochaines découvertes."}
                </p>
                <span className="mt-5 text-[11px] text-gray-400">
                  {dateValue(project.createdAt)
                    ? `Créé le ${new Date(project.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`
                    : "Date de création non renseignée"}
                </span>
              </Link>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 px-5 py-3 text-xs text-gray-500 dark:border-white/5 dark:text-gray-400">
                <Link
                  to={`/projects/${project.id}/plots`}
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <MapPin size={13} />
                  {project.numberOfPlots} parcelle
                  {project.numberOfPlots !== 1 ? "s" : ""}
                </Link>
                <Link
                  to={`/projects/${project.id}/members`}
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <Users size={13} />
                  {project.numberOfMembers ?? 1} membre
                  {(project.numberOfMembers ?? 1) !== 1 ? "s" : ""}
                </Link>
                <Link
                  to={`/projects/${project.id}/dashboard`}
                  aria-label={`Ouvrir ${project.name}`}
                  className="ml-auto rounded p-1 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {creating && <CreateProjectModal onClose={() => setCreating(false)} />}
      <Dialog
        open={!!deleting}
        onClose={() => {
          if (!removal.isPending) setDeleting(null);
        }}
        className="relative z-[9999]"
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#171717]">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Supprimer ce projet ?
              </DialogTitle>
              <button
                disabled={removal.isPending}
                onClick={() => setDeleting(null)}
                aria-label="Fermer"
                className={iconButton}
              >
                <X size={18} />
              </button>
            </div>
            <Description className="mt-3 break-words text-sm leading-relaxed text-gray-500">
              Le projet « {deleting?.name} », ses liens vers les parcelles et
              ses accès membres seront supprimés. Cette action est définitive.
            </Description>
            <div className="mt-6 flex justify-end gap-3">
              <button
                autoFocus
                disabled={removal.isPending}
                onClick={() => setDeleting(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                disabled={removal.isPending}
                onClick={() => {
                  if (deleting) removal.mutate(deleting.id);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {removal.isPending && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                Supprimer
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
