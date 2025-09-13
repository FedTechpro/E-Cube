import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import CancelNotification from "../components/CancelNotification";

export default function BookTicket() {
  const location = useLocation();
  const movie = location.state?.movie;
  const { user } = useContext(AuthContext);
  const [lastTicketId, setLastTicketId] = useState(null);
  const [showCancelNotification, setShowCancelNotifcation] = useState(false);
  const [message, setMessage] = useState("Booking Cancelled");

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    theatre: "",
    tickets: 1,
  });
  const [submitted, setSubmitted] = useState(false);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-300">
        <p>No movie details found.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTicket = {
      id: Date.now(),
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      runtime: movie.runtime,
      user: user.email,
      ...formData,
    };

    const existing = JSON.parse(localStorage.getItem("tickets")) || [];
    existing.push(newTicket);
    localStorage.setItem("tickets", JSON.stringify(existing));

    setLastTicketId(newTicket.id);
    setSubmitted(true);
  };

  async function handleCancel() {
    try {
      if (!lastTicketId) return;

      const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
      const newTickets = tickets.filter((ticket) => ticket.id !== lastTicketId);
      localStorage.setItem("tickets", JSON.stringify(newTickets));

      setShowCancelNotifcation(true);
      setSubmitted(false);
      setFormData({
        date: "",
        time: "",
        theatre: "",
        tickets: 1,
      });
      setLastTicketId(null);
    } catch (error) {
      setMessage("Error cancelling booking");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6 flex justify-center items-start">
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">
        {/* Movie Info */}
        <div className="flex-shrink-0 w-full md:w-1/3 bg-gray-900/40 backdrop-blur-md rounded-xl p-4 flex flex-col items-center md:items-start">
          {/* Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className="w-2/3 md:w-full rounded-lg shadow-md object-cover mb-4"
          />
          {/* Movie Text Info */}
          <div className="text-center md:text-left hidden sm:block md:block">
            <h1 className="text-xl font-semibold">{movie.title}</h1>
            <p className="text-gray-400 text-sm mt-1">{movie.release_date}</p>
          </div>
        </div>

        {/* Booking Form / Confirmation */}
        <div className="flex-1 w-full">
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 w-full"
            >
              <h2 className="text-3xl font-semibold mb-4">
                Book Your Ticket 🎟️
              </h2>

              {/* Date */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium text-lg">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#E2383F] outline-none transition"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium text-lg">
                  Time
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#E2383F] outline-none transition"
                >
                  <option value="">Select time</option>
                  <option>12:00 PM</option>
                  <option>3:00 PM</option>
                  <option>6:00 PM</option>
                  <option>9:00 PM</option>
                </select>
              </div>

              {/* Theatre */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium text-lg">
                  Theatre
                </label>
                <select
                  name="theatre"
                  value={formData.theatre}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#E2383F] outline-none transition"
                >
                  <option value="">Select theatre</option>
                  <option>Theatre A</option>
                  <option>Theatre B</option>
                  <option>Theatre C</option>
                </select>
              </div>

              {/* Tickets */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium text-lg">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  name="tickets"
                  value={formData.tickets}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-4 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#E2383F] outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#E2383F] rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg text-lg"
              >
                Confirm Booking
              </button>
            </form>
          ) : (
            <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full text-center">
              <h2 className="text-3xl font-bold mb-6 text-green-400">
                Booking Confirmed 🎉
              </h2>
              <div className="space-y-3 text-gray-200 text-lg">
                <p>
                  <span className="font-semibold text-white">Movie:</span>{" "}
                  {movie.title}
                </p>
                <p>
                  <span className="font-semibold text-white">Date:</span>{" "}
                  {formData.date}
                </p>
                <p>
                  <span className="font-semibold text-white">Time:</span>{" "}
                  {formData.time}
                </p>
                <p>
                  <span className="font-semibold text-white">Theatre:</span>{" "}
                  {formData.theatre}
                </p>
                <p>
                  <span className="font-semibold text-white">Tickets:</span>{" "}
                  {formData.tickets}
                </p>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-lg"
                >
                  Book Another
                </button>

                <button
                  onClick={handleCancel}
                  className="px-6 py-4 bg-red-600 rounded-lg hover:bg-red-500 transition text-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <CancelNotification show={showCancelNotification} message={message} />
    </div>
  );
}
