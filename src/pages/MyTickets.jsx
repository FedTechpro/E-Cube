import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("You have no tickets booked yet.");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
    if (user) {
      const userTickets = storedTickets.filter(
        (ticket) => ticket.user === user.email
      );
      setTickets(userTickets);
    } else {
      setMessage("You have not logged in yet");
    }
  }, [user]);

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white ">
        <p className="text-gray-400 text-lg">{message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">My Tickets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-row hover:scale-105 transition-transform duration-300"
          >
            {/* Poster */}
            <div className="md:w-1/3">
              <img
                src={`https://image.tmdb.org/t/p/w300${ticket.poster}`}
                alt={ticket.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Ticket Details */}
            <div className="md:w-2/3 p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  {ticket.title}
                </h2>
                <p className="text-gray-400 text-sm mb-1">
                  🎬 {ticket.runtime ? `${ticket.runtime} mins | ` : ""}
                  {ticket.date} | {ticket.time}
                </p>
                <p className="text-gray-400 text-sm mb-1">
                  🏛️ Theatre: {ticket.theatre}
                </p>
                <p className="text-gray-400 text-sm mb-1">
                  🎟️ Tickets: {ticket.tickets}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
