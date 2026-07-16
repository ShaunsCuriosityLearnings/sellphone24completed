import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-md ring-1 ring-gray-200">
      <Search className=" w-5 h-5 text-gray-500" />
      <input
        type="search"
        placeholder="Search..."
        className="text-smbg-transparent border-none outline-0"
      />
    </div>
  );
};

export default SearchBar;
