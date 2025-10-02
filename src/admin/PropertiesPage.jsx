import React, { useContext, useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { ToastContext } from "../context/ToastContext";

const PropertiesPage = () => {
  const { showToast } = useContext(ToastContext);
  const [properties, setProperties] = useState([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/admin/manage/properties",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "list",
            payload: { page, limit, status: statusFilter },
          }),
        }
      );
      const data = await response.json();
      setProperties(data.properties);
      setTotalProperties(data.total);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, [page, statusFilter]);

  const handlePropertyAction = async (type, propertyId) => {
    setActionLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/admin/manage/properties",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, payload: { propertyId } }),
        }
      );
      const data = await response.json();
      console.log(data.message);
      showToast(`Property status updated  sucessfully`, "success");
      fetchProperties();
    } catch (err) {
      console.error("Property action failed:", err);
      showToast(`Property status update failed `, "error");
    }
    setActionLoading(false);
  };

  const totalPages = Math.ceil(totalProperties / limit);

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
      <h1 className="text-2xl font-bold mb-4">Properties Management</h1>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg w-full sm:w-1/4"
        >
          <option value="">All Properties</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>

      {/* Properties Table */}
      {loading ? (
        <div className="text-center mt-10">Loading properties...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Title</th>
                <th className="p-3 border-b">Location</th>
                <th className="p-3 border-b">Price</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Verified</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{prop.title}</td>
                  <td className="p-3 border-b">
                    {prop.town}, {prop.neighbourhood}
                  </td>
                  <td className="p-3 border-b">
                    {prop.price.toLocaleString()} XAF
                  </td>
                  <td className="p-3 border-b capitalize">{prop.status}</td>
                  <td className="p-3 border-b">
                    {prop.isVerified ? "Yes" : "No"}
                  </td>
                  <td className="p-3 border-b text-center relative">
                    <div className="relative inline-block text-left dropdown">
                      <button
                        className="p-1 rounded hover:bg-gray-200"
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === prop._id ? null : prop._id
                          )
                        }
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {openDropdownId === prop._id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-10">
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() =>
                              alert("Edit property: " + prop.title)
                            }
                          >
                            Edit
                          </button>

                          {prop.status === "available" && (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              disabled={actionLoading}
                              onClick={() =>
                                handlePropertyAction("markRented", prop._id)
                              }
                            >
                              Mark as Rented
                            </button>
                          )}
                          {prop.status === "rented" && (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              disabled={actionLoading}
                              onClick={() =>
                                handlePropertyAction("markAvailable", prop._id)
                              }
                            >
                              Mark as Available
                            </button>
                          )}
                          {prop.status !== "deactivated" ? (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              disabled={actionLoading}
                              onClick={() =>
                                handlePropertyAction("deactivate", prop._id)
                              }
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              disabled={actionLoading}
                              onClick={() =>
                                handlePropertyAction("activate", prop._id)
                              }
                            >
                              Activate
                            </button>
                          )}

                          {!prop.isVerified && (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              disabled={actionLoading}
                              onClick={() =>
                                handlePropertyAction("verify", prop._id)
                              }
                            >
                              Verify Property
                            </button>
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

export default PropertiesPage;
