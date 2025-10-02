import React, { useContext, useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { ToastContext } from "../context/ToastContext";

const RequestsPage = () => {
  const { showToast } = useContext(ToastContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [totalRequests, setTotalRequests] = useState(0);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/admin/manage/requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "get",
            payload: { page, limit, status: statusFilter },
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
        setTotalRequests(data.pagination.total);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter]);

  const handleStatusChange = async (requestId, newStatus) => {
    setActionLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/admin/manage/requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "update-status",
            payload: { requestId, newStatus },
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        showToast(`Request status updated sucessfully`, "success");
        fetchRequests(); // refresh list
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast(`There was an error updating Request status`, "error");
    }
    setActionLoading(false);
  };

  const totalPages = Math.ceil(totalRequests / limit);

  // Close dropdown when clicking outside
  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (!event.target.closest(".dropdown")) {
  //         setOpenDropdownId(null);
  //       }
  //     };
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  //   }, []);

  return (
    <div className=" min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Requests Management</h1>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg w-full sm:w-1/4"
        >
          <option value="all">All Requests</option>
          <option value="searching">Searching</option>
          <option value="match-found">Match Found</option>
          <option value="contacted">Contacted</option>
        </select>
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="text-center mt-10">Loading requests...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Requester</th>
                <th className="p-3 border-b">Property</th>
                <th className="p-3 border-b">Requested Date</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{req.whatsapp || "-"}</td>
                  <td className="p-3 border-b">{req.requestText || "-"}</td>
                  <td className="p-3 border-b">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border-b capitalize">{req.status}</td>
                  <td className="p-3 border-b text-center relative">
                    <div className="relative inline-block text-left dropdown">
                      <button
                        className="p-1 rounded hover:bg-gray-200"
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === req._id ? null : req._id
                          )
                        }
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {openDropdownId === req._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                          {["searching", "match-found", "contacted"].map(
                            (status) => (
                              <button
                                key={status}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                disabled={
                                  actionLoading || req.status === status
                                }
                                onClick={() =>
                                  handleStatusChange(req._id, status)
                                }
                              >
                                Set as {status.replace("-", " ")}
                              </button>
                            )
                          )}
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
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <p>
          Page {page} of {totalPages}
        </p>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RequestsPage;
