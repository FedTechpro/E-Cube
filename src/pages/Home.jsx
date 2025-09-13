import Hero from "../components/Hero";
import LatestMovies from "../components/LatestMovies";
import UpcominMovies from "../components/UpcomingMovies";
import Events from "../components/Events";

export default function Home({ searchActive, setSearchActive }) {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white ">
      <Hero />

      <LatestMovies />
      <UpcominMovies />
      <Events />
    </div>
  );
}
