import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react"; // Import all lucide icons

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/admin/stats");
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);

        console.log(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const { users, properties, requests, support } = dashboardData;

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-black mb-6">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        {/* Users */}
        <div className="bg-white border rounded-lg p-6 shadow hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{formatNumber(users.total)}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <LucideIcons.Users className="text-indigo-700 w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="bg-white border rounded-lg p-6 shadow hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Properties</p>
              <p className="text-2xl font-bold">
                {formatNumber(properties.total)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <LucideIcons.Home className="text-green-600 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Properties & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Properties */}
        <div className="bg-white border rounded-lg shadow hover:shadow-md transition">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-black">Recent Properties</h2>
          </div>
          {properties.latest.map((p) => (
            <div
              key={p._id}
              className="px-6 py-3 border-b last:border-0 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-black">{p.title}</p>
                <p className="text-sm text-gray-500">
                  {p.town}, {p.neighbourhood}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{formatNumber(p.price)} XAF</span>
                {p.status === "available" ? (
                  <LucideIcons.CheckCircle className="text-green-500 w-5 h-5" />
                ) : (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                    {p.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Users */}
        <div className="bg-white border rounded-lg shadow hover:shadow-md transition">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-black">Recent Users</h2>
          </div>
          {users.latest.map((u) => (
            <div
              key={u._id}
              className="px-6 py-3 border-b last:border-0 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-black">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {u.isVerified ? (
                  <LucideIcons.CheckCircle className="text-green-500 w-5 h-5" />
                ) : (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                    Unverified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Pending Requests */}
        <div className="bg-white border rounded-lg p-6 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-black">Searching Requests</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <LucideIcons.Search className="text-green-600 w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold">
            {formatNumber(requests.searchingCount)}
          </p>
        </div>

        {/* Pending Support */}
        <div className="bg-white border rounded-lg p-6 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-black">Pending Tickets</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <LucideIcons.HelpCircle className="text-yellow-600 w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold">
            {formatNumber(support.pendingCount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
