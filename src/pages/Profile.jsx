import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [bookingsCount, setBookingsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
    if (user) {
      const userTickets = storedTickets.filter(
        (ticket) => ticket.user === user.email
      );
      setBookingsCount(userTickets.length);
    }
  }, [user]);

  function handleToLogin() {
    navigate("/login");
  }

  // Get first letter of email for avatar
  const avatarLetter = user?.email?.charAt(0).toUpperCase() || "?";

  return user ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl shadow-xl p-8 w-full max-w-md text-center text-white">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-purple-600 text-3xl font-bold shadow-md">
            {avatarLetter}
          </div>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold mb-2">{user?.email}</h2>
        <p className="text-gray-400 mb-6">Welcome to your profile 🎉</p>

        {/* Bookings Count */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-md mb-6">
          <p className="text-lg font-semibold">
            Total Bookings:{" "}
            <span className="text-purple-400 font-bold">{bookingsCount}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-full shadow-md text-sm font-semibold transition">
            Edit Profile
          </button>
          <button
            onClick={logout}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-full shadow-md text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6 text-white">
      <p className="text-gray-400 mb-4">You are not logged in</p>
      <button
        onClick={() => handleToLogin()}
        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-full shadow-md text-sm font-semibold transition"
      >
        Login
      </button>
    </div>
  );
}
