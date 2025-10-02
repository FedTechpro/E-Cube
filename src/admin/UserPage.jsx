import React, { useContext, useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../context/ToastContext";

const UsersPage = () => {
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null); // track which user's menu is open

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/admin/manage/user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "list",
            payload: { page, limit, search, filter },
          }),
        }
      );
      const data = await response.json();
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, filter]);

  // Close dropdown if clicked outside

  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (!event.target.closest(".user-dropdown")) {
  //         setOpenMenuId(null);
  //       }
  //     };
  //     document.addEventListener("click", handleClickOutside);
  //     return () => document.removeEventListener("click", handleClickOutside);
  //   }, []);

  const handleUserAction = async (type, userId) => {
    setActionLoading(true);
    try {
      await fetch("http://localhost:4000/api/admin/manage/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload: { userId } }),
      });
      showToast(`User status updated  sucessfully`, "success");
      fetchUsers();
      setOpenMenuId(null);
    } catch (err) {
      console.error("User action failed:", err);
      showToast(`User status update failed`, "error");
    }
    setActionLoading(false);
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className=" min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Users Management
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by WhatsApp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-1/4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
        >
          <option value="">All Users</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center mt-10 text-gray-500">Loading users...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b text-gray-600 font-medium">Name</th>
                <th className="p-3 border-b text-gray-600 font-medium">
                  Email
                </th>
                <th className="p-3 border-b text-gray-600 font-medium">
                  WhatsApp
                </th>
                <th className="p-3 border-b text-gray-600 font-medium">
                  Status
                </th>
                <th className="p-3 border-b text-gray-600 font-medium">
                  Verified
                </th>
                <th className="p-3 border-b text-gray-600 font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 border-b">{user.name}</td>
                  <td className="p-3 border-b">{user.email}</td>
                  <td className="p-3 border-b">{user.whatsapp || "-"}</td>
                  <td className="p-3 border-b capitalize">{user.status}</td>
                  <td className="p-3 border-b">
                    {user.isVerified ? "Yes" : "No"}
                  </td>
                  <td className="p-3 border-b text-center relative">
                    {/* Three-dot menu */}
                    <div className="relative inline-block text-left user-dropdown">
                      <button
                        className="p-2 rounded hover:bg-gray-200 transition"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent global click handler
                          setOpenMenuId(
                            openMenuId === user._id ? null : user._id
                          );
                        }}
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {openMenuId === user._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-20">
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => alert("Edit user: " + user.name)}
                          >
                            Edit
                          </button>

                          {user.status === "banned" ? (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              disabled={actionLoading}
                              onClick={() =>
                                handleUserAction("unban", user._id)
                              }
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              disabled={actionLoading}
                              onClick={() => handleUserAction("ban", user._id)}
                            >
                              Ban
                            </button>
                          )}

                          {!user.isVerified && (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              disabled={actionLoading}
                              onClick={() =>
                                handleUserAction("verify", user._id)
                              }
                            >
                              Verify User
                            </button>
                          )}

                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() =>
                              navigate("/post-property", { state: user._id })
                            }
                          >
                            Post on Behalf
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Prev
        </button>
        <p className="text-gray-700">
          Page {page} of {totalPages}
        </p>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
