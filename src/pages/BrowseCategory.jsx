import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Movie from "../components/Movie";

export default function BrowseCategory() {
  const { category } = useParams();
  const location = useLocation();
  const { Movietype } = location.state || {};

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch movies
  const getMovies = async (pageNum) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${Movietype}/${category}?api_key=0d8305359bc214ffa9cdc4522b498a0c&language=en-US&page=${pageNum}`
      );
      const data = await response.json();

      if (data.results?.length > 0) {
        setMovies((prev) => [...prev, ...data.results]);
        setHasMore(pageNum < data.total_pages);
      } else {
        setHasMore(false);
        setShowButton(false);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
      setButtonLoading(false);
    }
  };

  // Reset when category/type changes
  useEffect(() => {
    if (Movietype && category) {
      setMovies([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);
      getMovies(1);
    }
  }, [category, Movietype]);

  // Load more handler
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getMovies(nextPage);
    setButtonLoading(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-white mb-4 capitalize">
        {category} {Movietype === "movie" ? "Movies" : "TV Shows"}
      </h2>

      {loading && movies.length === 0 ? (
        // Skeleton Loader (initial load)
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {Array.from({ length: 14 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-800 animate-pulse rounded-lg h-48 w-full"
            ></div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {movies.map((movie) => (
              <Movie key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              {showButton ? (
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-[#E2383F] text-white rounded-lg shadow hover:bg-red-700 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {buttonLoading ? "Loading..." : "Load More"}
                </button>
              ) : (
                <p>Your Caught Up</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-400 text-center">No movies found.</p>
      )}
    </div>
  );
}
