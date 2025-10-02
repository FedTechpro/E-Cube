import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";

// Lazy loading image helper
function LazyImage({ src, alt, className }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-cover rounded-md ${className}`}
    />
  );
}

export default function MyListings() {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });

  // Fetch user properties
  useEffect(() => {
    if (!user?._id) return;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:4000/api/property/my-listings",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "fetch",
              payload: {
                page: currentPage,
                limit: itemsPerPage,
                status: filter === "all" ? undefined : filter,
              },
            }),
            credentials: "include",
          }
        );
        const data = await res.json();
        setProperties(data.data || []);
        setMeta(data.meta || { total: 0, page: 1, totalPages: 1 });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user?._id, filter, currentPage, itemsPerPage]);

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const changeStatus = async (id, newStatus) => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/property/my-listings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            payload: { id, data: { status: newStatus } },
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      const updated = data.data;
      setProperties((prev) =>
        prev.map((p) => (p._id === id ? { ...p, ...updated } : p))
      );
      setDropdownOpen(null);
      showToast(
        `property status updated as ${updated.status} sucessfully`,
        "success"
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deleteProperty = async (id) => {
    try {
      await fetch("http://localhost:4000/api/property/my-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", payload: { id } }),
        credentials: "include",
      });
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setDropdownOpen(null);
      showToast(`property deleted Successfully`, "success");
    } catch (err) {
      console.error("Failed to delete property:", err);
    }
  };

  const nextPage = () =>
    currentPage < meta.totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "rented":
        return "bg-blue-100 text-blue-800";
      case "deactivated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          My Listings
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md font-medium transition-colors">
            Add New Property
          </button>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="deactivated">Deactivated</option>
            </select>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table (Desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posted Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <LazyImage
                      src={p.propertyImages[0].url}
                      alt={p.title}
                      className="h-10 w-10"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {p.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat().format(p.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {p.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      p.status
                    )}`}
                  >
                    {p.status?.charAt(0).toUpperCase() + p.status?.slice(1) ||
                      "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {p.status === "available" && (
                      <button
                        onClick={() => changeStatus(p._id, "rented")}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Mark as Rented
                      </button>
                    )}
                    {p.status === "rented" && (
                      <button
                        onClick={() => changeStatus(p._id, "available")}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Mark as Available
                      </button>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(p._id)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {dropdownOpen === p._id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            <button
                              onClick={() =>
                                changeStatus(
                                  p._id,
                                  p.status === "deactivated"
                                    ? "available"
                                    : "deactivated"
                                )
                              }
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              {p.status === "deactivated"
                                ? "Activate"
                                : "Deactivate"}
                            </button>
                            <button
                              onClick={() => deleteProperty(p._id)}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {properties.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow overflow-hidden rounded-lg p-4 border border-gray-100 relative"
          >
            <div className="flex items-start gap-3">
              <LazyImage
                src={p.propertyImages[0].url}
                alt={p.title}
                className="h-14 w-14"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                    {p.title}
                  </p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      p.status
                    )}`}
                  >
                    {p.status?.charAt(0).toUpperCase() + p.status?.slice(1) ||
                      "Unknown"}
                  </span>
                </div>
                <p className="text-sm text-gray-900 mt-1">
                  {" "}
                  {new Intl.NumberFormat().format(p.price)}
                </p>
                <p className="text-xs text-gray-500">{p.location}</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Posted: {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    {p.status === "available" && (
                      <button
                        onClick={() => changeStatus(p._id, "rented")}
                        className="text-xs text-indigo-600 hover:text-indigo-900 whitespace-nowrap"
                      >
                        Mark Rented
                      </button>
                    )}
                    {p.status === "rented" && (
                      <button
                        onClick={() => changeStatus(p._id, "available")}
                        className="text-xs text-indigo-600 hover:text-indigo-900 whitespace-nowrap"
                      >
                        Mark Available
                      </button>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(p._id)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {dropdownOpen === p._id && (
                        <div className="origin-top-right absolute right-0 z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            <button
                              onClick={() =>
                                changeStatus(
                                  p._id,
                                  p.status === "deactivated"
                                    ? "available"
                                    : "deactivated"
                                )
                              }
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              {p.status === "deactivated"
                                ? "Activate"
                                : "Deactivate"}
                            </button>
                            <button
                              onClick={() => deleteProperty(p._id)}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta.total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, meta.total)}
            </span>{" "}
            of <span className="font-medium">{meta.total}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              }`}
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === meta.totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === meta.totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {!loading && meta.total === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No properties found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
