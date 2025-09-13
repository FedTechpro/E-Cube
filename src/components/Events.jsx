import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Movie from "./Movie";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/tv/on_the_air?api_key=0d8305359bc214ffa9cdc4522b498a0c&language=en-US&page=1"
        );
        const data = await response.json();
        setEvents(data.results);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  function handleMore() {
    navigate("/more/on_the_air", { state: { Movietype: "tv" } });
  }

  // Scroll handler
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-xl font-bold text-white">Events</h2>
        <button
          onClick={handleMore}
          className="text-[#E2383F] hover:text-[#E2383F] font-medium"
        >
          More →
        </button>
      </div>

      <div className="relative">
        {/* Scroll buttons for large devices */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 p-1 rounded-full z-10 hover:bg-black"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 p-1 rounded-full z-10 hover:bg-black"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Events List */}
        <div
          ref={scrollRef}
          className="flex space-x-3 overflow-x-auto overflow-y-hidden px-4 scroll-smooth scrollbar-none"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-none w-28 sm:w-32 md:w-36 animate-pulse"
                >
                  <div className="w-full h-40 sm:h-48 md:h-52 bg-gray-700 rounded-lg"></div>
                  <div className="h-4 bg-gray-600 mt-2 rounded"></div>
                </div>
              ))
            : events.map((movie) => <Movie key={movie.id} movie={movie} />)}
        </div>
      </div>

      {/* Tailwind CSS to fully hide scrollbar */}
      <style>
        {`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
}
