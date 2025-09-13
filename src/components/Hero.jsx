import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

export default function Hero() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/popular?api_key=0d8305359bc214ffa9cdc4522b498a0c&language=en-US&page=1"
        );
        const data = await response.json();
        setMovies(data.results.slice(0, 5)); // Only 5 movies for simplicity
        setLoading(false);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
        setLoading(false);
      }
    };
    fetchPopularMovies();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    pauseOnHover: false,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  const goToSlide = (index) => {
    sliderRef.current?.slickGoTo(index);
  };

  const nextSlide = () => {
    sliderRef.current?.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current?.slickPrev();
  };

  if (loading) {
    return (
      <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] bg-gray-900 overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`}>
            <div
              key={movie.id}
              className="relative h-[40vh] sm:h-[50vh] md:h-[60vh]"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${
                    movie.backdrop_path || movie.poster_path
                  })`,
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 text-white z-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 truncate">
                  {movie.title}
                </h2>
                <div className="flex items-center text-xs sm:text-sm text-gray-300">
                  {movie.release_date && (
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  )}
                  {movie.vote_average && (
                    <span className="ml-2 flex items-center">
                      <StarIcon className="w-3 h-3 mr-1 text-yellow-400" />
                      {movie.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </Slider>

      {/* Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? "bg-red-600" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-all"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-5 h-5 text-white" />
      </button>
    </section>
  );
}

// Simple Icon Components
const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ChevronLeftIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);
