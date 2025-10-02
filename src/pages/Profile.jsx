import React, { useContext, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Skeleton Loader
const SkeletonProfile = () => (
  <div className="p-6 animate-pulse max-w-2xl mx-auto">
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-20 h-20 rounded-full bg-gray-300" />
      <div className="flex-1">
        <div className="h-5 bg-gray-300 rounded w-40 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-56" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-60" />
      <div className="h-4 bg-gray-200 rounded w-48" />
      <div className="h-4 bg-gray-200 rounded w-32" />
    </div>
  </div>
);

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [totalProperties, setTotalProperties] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/user/me", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setProfile(data.profile);
        setTotalProperties(data.totalProperties);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return <SkeletonProfile />;

  if (!profile) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load profile. Please try again.
      </div>
    );
  }

  const firstLetter = profile.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 border-b pb-6 mb-6">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-indigo-700 text-white text-3xl font-bold flex-shrink-0">
            {firstLetter}
          </div>
          <div className="mt-4 sm:mt-0 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Profile Details
            </h2>
            <div className="mt-3 space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Role:</span> {profile.role}
              </p>
              <p>
                <span className="font-medium">Status:</span> {profile.status}
              </p>
              {(profile.role === "landlord" ||
                profile.role === "caretaker") && (
                <p>
                  <span className="font-medium">Total Properties:</span>{" "}
                  {totalProperties}
                </p>
              )}
            </div>
          </div>

          {/* Advanced Section */}
          <div>
            <button
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="flex items-center justify-between w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              <span className="text-gray-700 font-medium">Advanced</span>
              {showAdvanced ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
