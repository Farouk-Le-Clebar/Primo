type SearchUsersProps = {
    query: string;
    onQueryChange: (newQuery: string) => void;
}

const SearchUsers = ({ query, onQueryChange }: SearchUsersProps) => {
    return (
        <div className="flex items-center justify-center pt-4 w-full">
            <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="border w-full border-gray-300 rounded-xl py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#388160]"
            />
        </div>
    );
}

export default SearchUsers;