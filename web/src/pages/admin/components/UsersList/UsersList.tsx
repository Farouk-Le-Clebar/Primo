import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@tremor/react";

// COMPONENTS
import { getUsers, searchUsers, deleteUser } from "../../../../requests/admin";
import type { UserType } from "../../../../types/admin";
import UsersGrid from "./UsersGrid";
import AdminSearchInput from "../shared/AdminSearchInput";

const PAGE_SIZE = 12;

const UsersList = () => {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [query, setQuery] = useState("");
  const [fromTo, setFromTo] = useState({ from: 0, to: PAGE_SIZE });

  const queryClient = useQueryClient();
  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedQuery(query.trim()),
      250,
    );
    return () => window.clearTimeout(timeout);
  }, [query]);
  const {
    data: users = [],
    isFetching,
    isError,
    refetch,
  } = useQuery<UserType[]>({
    queryKey: ["users", fromTo.from, fromTo.to, debouncedQuery],
    queryFn: () =>
      debouncedQuery
        ? searchUsers(debouncedQuery)
        : getUsers(fromTo.from, fromTo.to),
  });

  const { mutate: mutateDelete, isPending: isDeletePending } = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      toast.success("Utilisateur supprimé avec succès.");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      void queryClient.invalidateQueries({ queryKey: ["adminStatistics"] });
      queryClient.invalidateQueries({ queryKey: ["usersChart"] });
    },
    onError: () => toast.error("Impossible de supprimer l'utilisateur."),
  });

  const handleSetFromTo = (from: number, to: number) => setFromTo({ from, to });
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setFromTo({ from: 0, to: PAGE_SIZE });
  };
  const isWorking = isFetching || debouncedQuery !== query.trim();
  const currentPage = Math.floor(fromTo.from / PAGE_SIZE) + 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="primo-page-enter flex items-center justify-between gap-3">
        <AdminSearchInput value={query} placeholder="Rechercher un nom, email..." onChange={handleQueryChange} />
        {isWorking && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
      </div>
      {isError && (
        <p role="alert" className="text-sm text-red-500">
          Impossible de charger les utilisateurs.{" "}
          <button className="underline cursor-pointer" onClick={() => void refetch()}>
            Réessayer
          </button>
        </p>
      )}
      <UsersGrid
        key={`${fromTo.from}-${debouncedQuery}`}
        users={users}
        isWorking={isWorking}
        isDeletePending={isDeletePending}
        onDelete={(userId) => mutateDelete(userId)}
      />
      {query.trim() === "" && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-white/10">
          <Button
            variant="light"
            icon={ChevronLeft}
            onClick={() => handleSetFromTo(Math.max(0, fromTo.from - PAGE_SIZE), Math.max(PAGE_SIZE, fromTo.to - PAGE_SIZE))}
            disabled={fromTo.from === 0 || isWorking}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white dark:hover:bg-white/5"
          >
            Précédent
          </Button>
          <span className="text-sm tabular-nums text-gray-500 dark:text-gray-400">Page {currentPage}</span>
          <Button
            variant="light"
            iconPosition="right"
            icon={ChevronRight}
            onClick={() => handleSetFromTo(fromTo.from + PAGE_SIZE, fromTo.to + PAGE_SIZE)}
            disabled={users.length < PAGE_SIZE || isWorking}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white dark:hover:bg-white/5"
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersList;
