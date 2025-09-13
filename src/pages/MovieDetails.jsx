import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Ticket } from "lucide-react";
import Logo from "../images/E-Cube LOGO.png";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  function handleBooking() {
    navigate(`/book-ticket/${movie.id}`, {
      state: { movie }, // ✅ send payload here
    });
  }

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=0d8305359bc214ffa9cdc4522b498a0c&language=en-US`
        );
        const data = await res.json();
        setMovie(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie:", err);
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  if (!movie) {
    return <div className="p-6 text-white">Movie not found.</div>;
  }

  return (
    <div className="relative min-h-screen text-white">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/95" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        {/* Poster */}
        <div className="md:col-span-1 flex justify-center">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-2xl shadow-2xl w-full h-4/3 md:w-full contain"
          />
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="text-lg italic text-gray-300">{movie.tagline}</p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-black/40 px-3 py-1 rounded-full">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="ml-2 font-semibold">
                {movie.vote_average?.toFixed(1)}
              </span>
              <span className="ml-2 text-sm text-gray-400">
                ({movie.vote_count} reviews)
              </span>
            </div>
            {movie.runtime > 0 && (
              <span className="px-3 py-1 bg-black/40 rounded-full text-sm">
                ⏱ {movie.runtime} mins
              </span>
            )}
            <span className="px-3 py-1 bg-black/40 rounded-full text-sm">
              📅 {movie.release_date}
            </span>
          </div>

          <p className="leading-relaxed text-gray-200">{movie.overview}</p>

          {movie.genres?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-purple-700/80 hover:bg-purple-700 rounded-full text-sm transition"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {movie.production_companies?.length > 0 && (
            <div className="pb-16">
              <h3 className="text-xl font-semibold mb-3">
                Production Companies
              </h3>
              <div className="flex flex-wrap gap-4">
                {movie.production_companies.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    {c.logo_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${c.logo_path}`}
                        alt={c.name}
                        className="h-6 bg-white rounded p-1"
                      />
                    )}
                    <span className="text-sm">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Book Tickets button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => handleBooking()}
          className="flex items-center gap-1 px-5 w-62  py-2 bg-[#5617eb] rounded-full text-lg font-semibold shadow-lg hover:bg-[#4312c9] transition"
        >
          <Ticket className="w-5 h-5" />
          Book Tickets
        </button>
      </div>
    </div>
  );
}
