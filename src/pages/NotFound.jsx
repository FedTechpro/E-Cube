import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 text-center">
      <h1 className="text-9xl font-extrabold mb-4 text-red-600">404</h1>
      <h2 className="text-4xl font-bold mb-2">Oops! Page Not Found</h2>
      <p className="text-gray-300 mb-6 max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
      >
        Go Back Home
      </button>
    </div>
  );
}
