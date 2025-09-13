import { useState } from "react";
import { X, XCircle } from "lucide-react";
import Movie from "../components/Movie";

export default function SearchOverlay({ searchActive, setSearchActive }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const suggestions = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
  ];

  const handleSearch = async (term) => {
    setQuery(term);
    if (!term) {
      setResults([]);
      return;
    }

    setSearching(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=0d8305359bc214ffa9cdc4522b498a0c&query=${term}&language=en-US&page=1`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const handleClose = () => {
    setSearchActive(false);
    setQuery("");
    setResults([]);
  };

  const handleClearInput = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div>
      {searchActive && (
        <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto">
          <div className="flex flex-col items-center p-4 md:p-16 min-h-screen">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="self-end mb-4 md:mb-8 text-white hover:text-[#E2383F] transition"
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Search input container */}
            <div className="relative w-full md:w-7/12">
              <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#E2383F] text-sm md:text-lg"
                autoFocus
              />
              {/* Clear input icon */}
              {query && (
                <button
                  onClick={handleClearInput}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E2383F]"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Suggestions */}
            {query === "" && (
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(sug)}
                    className="px-3 py-1 bg-gray-700 rounded-full hover:bg-[#E2383F] transition text-sm md:text-base"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Search results */}
            <div className="mt-6 w-full md:w-full">
              {searching && (
                <p className="text-gray-400 text-center">Searching...</p>
              )}

              {!searching && query !== "" && results.length === 0 && (
                <p className="text-gray-400 text-center">
                  No results for "{query}"
                </p>
              )}

              {!searching && results.length > 0 && (
                <div
                  className="grid grid-cols-3
                 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4"
                >
                  {results.map((movie) => (
                    <Movie
                      key={movie.id}
                      movie={movie}
                      setSearchActive={setSearchActive}
                      setQuery={setQuery}
                      setResults={setResults}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
