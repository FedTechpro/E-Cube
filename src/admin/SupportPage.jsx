import React, { useContext, useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { ToastContext } from "../context/ToastContext";

const SupportPage = () => {
  const { showToast } = useContext(ToastContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [totalTickets, setTotalTickets] = useState(0);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/admin/manage/Support",
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
        setTickets(data.data);
        setTotalTickets(data.pagination.total);
      }
    } catch (err) {
      console.error("Failed to fetch support tickets:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [page, statusFilter]);

  const handleStatusChange = async (ticketId, newStatus) => {
    setActionLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/admin/manage/Support",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "update-status",
            payload: { ticketId, newStatus },
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        showToast(`Support status updated  sucessfully`, "success");
        fetchTickets();
      } else {
        console.error(data.error);
        showToast(`Support status update failed`, "error");
      }
    } catch (err) {
      console.error("Failed to update ticket status:", err);
      showToast(`Error updating Support status`, "error");
    }
    setActionLoading(false);
  };

  const totalPages = Math.ceil(totalTickets / limit);

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
      <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg w-full sm:w-1/4"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Tickets Table */}
      {loading ? (
        <div className="text-center mt-10">Loading support tickets...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Message</th>
                <th className="p-3 border-b">Subject</th>
                <th className="p-3 border-b">WhatsApp</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{ticket.name.split(" ")[0]}</td>
                  <td className="p-3 border-b">{ticket.message}</td>
                  <td className="p-3 border-b">{ticket.subject || "-"}</td>
                  <td className="p-3 border-b">{ticket.whatsapp || "-"}</td>
                  <td className="p-3 border-b capitalize">{ticket.status}</td>
                  <td className="p-3 border-b text-center relative">
                    <div className="relative inline-block text-left dropdown">
                      <button
                        className="p-1 rounded hover:bg-gray-200"
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === ticket._id ? null : ticket._id
                          )
                        }
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {openDropdownId === ticket._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                          {["pending", "in-progress", "completed"].map(
                            (status) => (
                              <button
                                key={status}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                disabled={
                                  actionLoading || ticket.status === status
                                }
                                onClick={() =>
                                  handleStatusChange(ticket._id, status)
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

export default SupportPage;
