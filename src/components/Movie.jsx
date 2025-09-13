import { Link } from "react-router-dom";

export default function Movie({
  movie,
  setSearchActive,
  setQuery,
  setResults,
  searchActive,
}) {
  function handleMovieClick() {
    if (searchActive) {
      setSearchActive(false);
      setQuery("");
      setResults("");
    }
  }
  return (
    <Link to={`/movie/${movie.id}`} onClick={() => handleMovieClick()}>
      <div
        key={movie.id}
        className="flex-none w-28 sm:w-32 md:w-36 cursor-pointer transform hover:scale-105 transition duration-300 ease-in-out"
      >
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title || movie.name}
          className="w-full h-40 sm:h-48 md:h-52 object-cover rounded-lg"
        />
        <p className="mt-2 text-sm text-left line-clamp-1 text-white">
          {movie.title || movie.name}
        </p>
      </div>
    </Link>
  );
}
