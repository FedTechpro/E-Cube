// Home.jsx
import React, { useState, useEffect, useRef } from "react";
import PropertyCard from "../components/PropertyCard";
import { Search, X, SlidersHorizontal, Loader2 } from "lucide-react";

import FilterDropdownModal from "../components/FilterDropdownModal";

export default function HomePage({ setIsRequestModalOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [town, setTown] = useState("");
  const [rooms, setRooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const filtersRef = useRef(null);

  const [selectedTown, setSelectedTown] = useState(null);
  const [customTown, setCustomTown] = useState("");

  const [initialLoading, setInitialLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loadMoreRef = useRef(null);

  // Calculate active filters
  useEffect(() => {
    const count = [
      category,
      propertyType,
      town,
      rooms,
      minPrice,
      maxPrice,
    ].filter((value) => value !== "" && value !== null).length;
    setActiveFilterCount(count);
  }, [category, propertyType, town, rooms, minPrice, maxPrice]);

  const fetchProperties = async (pageNum = 1) => {
    if (loading || pageNum > totalPages) return;
    if (pageNum === 1) setInitialLoading(true);
    else setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        category,
        propertyType,
        town,
        rooms,
        minPrice,
        maxPrice,
      });
      const res = await fetch(
        `http://localhost:4000/api/properties/search?${params.toString()}`
      );
      const data = await res.json();
      setProperties((prev) =>
        pageNum === 1
          ? data.properties || []
          : [...prev, ...(data.properties || [])]
      );

      setTotalPages(data.totalPages || 1);
      console.log(data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      if (pageNum === 1) setInitialLoading(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    setProperties([]);
    setPage(1);
    fetchProperties(1);
  }, [searchQuery, category, propertyType, town, rooms, minPrice, maxPrice]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, page, totalPages]);

  useEffect(() => {
    if (page === 1) return;
    fetchProperties(page);
  }, [page]);

  const clearAllFilters = () => {
    setCategory("");
    setPropertyType("");
    setTown("");
    setRooms("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedTown(null);
    setCustomTown("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="max-w-4xl mx-auto  py-4 relative" ref={filtersRef}>
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex items-center">
          <Search className="w-5 h-5 text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search by location, property type, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-3 text-gray-900 text-base border-0 focus:outline-none focus:ring-0 placeholder-gray-500"
          />

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 ml-2 relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:block text-sm font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters Modal */}
        <FilterDropdownModal
          category={category}
          setCategory={setCategory}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          selectedTown={selectedTown}
          setSelectedTown={setSelectedTown}
          rooms={rooms}
          setRooms={setRooms}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          clearAllFilters={clearAllFilters}
          activeFilterCount={activeFilterCount}
          customTown={customTown}
          setCustomTown={setCustomTown}
          setTown={setTown}
        />
      </div>

      {/* Property Listings Section */}
      <div className=" mx-auto  py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {properties?.length || 0} properties found{" "}
              {searchQuery && `for "${searchQuery}"`}
            </p>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
              <span className="text-xs text-gray-600 font-medium">
                Active filters:
              </span>
              <div className="flex flex-wrap gap-1">
                {category && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center font-medium">
                    {category}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-900"
                      onClick={() => setCategory("")}
                    />
                  </span>
                )}
                {propertyType && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center font-medium">
                    {propertyType}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-900"
                      onClick={() => setPropertyType("")}
                    />
                  </span>
                )}
                {town && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center font-medium">
                    {town}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-900"
                      onClick={() => setTown("")}
                    />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Initial Loading State */}
        {initialLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
              >
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            {/* Icon */}
            <div className="text-6xl mb-4">🔎</div>

            {/* Heading */}
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              We couldn’t find any properties
            </h3>

            {/* Subtitle */}
            <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
              No spaces match your current search. You can try adjusting
              filters, or let us know what type of property you’re looking for
              and we’ll help you out.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium w-full sm:w-auto"
              >
                Clear All Filters
              </button>

              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="px-5 py-2.5 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors text-sm font-medium w-full sm:w-auto"
              >
                Request a Property
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            <div
              ref={loadMoreRef}
              className="h-14 flex justify-center items-center mt-6"
            >
              {loading && page > 1 && (
                <Loader2 className="animate-spin text-indigo-700" size={24} />
              )}
            </div>
          </>
        )}
        {!initialLoading &&
          !loading &&
          properties.length > 0 &&
          page >= totalPages && (
            <div className="text-center py-6 text-gray-600 text-sm">
              🎉 You’ve reached the end of available listings.
              <p className="mt-2 text-gray-500">
                Didn’t find the exact property you’re looking for? Let us know
                what you need and we’ll try to find it for you.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="px-5 py-2.5 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
                >
                  Request a Property
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
