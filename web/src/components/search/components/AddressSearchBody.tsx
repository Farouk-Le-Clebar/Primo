import type { AddressSearchState } from "../../../hooks/useAddressSearch";
import SearchHistoryList from "./SearchHistoryList";
import SearchResultsList from "./SearchResultsList";

type AddressSearchBodyProps = {
  state: AddressSearchState;
};

const MESSAGE = "px-4 py-8 text-center text-sm text-gray-500";

export default function AddressSearchBody({ state }: AddressSearchBodyProps) {
  const { address, search, waiting, handleSelect } = state;
  const query = address.trim();

  if (!query) return <SearchHistoryList onSelect={handleSelect} />;
  if (query.length < 3)
    return <p className={MESSAGE}>Saisissez au moins 3 caractères pour rechercher.</p>;
  if (waiting)
    return <p role="status" className={MESSAGE}>Recherche des adresses…</p>;
  if (search.isError)
    return (
      <div className={MESSAGE}>
        <p>La recherche est momentanément indisponible.</p>
        <button
          onClick={() => void search.refetch()}
          className="mt-3 font-medium text-emerald-700 underline dark:text-emerald-400"
        >
          Réessayer
        </button>
      </div>
    );
  return (
    <SearchResultsList
      adressList={search.data?.features || []}
      addressQuery={address}
      isPending={false}
      onSelect={handleSelect}
    />
  );
}
