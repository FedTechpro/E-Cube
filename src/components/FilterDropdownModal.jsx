import { useState } from "react";
import cities from "../data/cities";
import { MapPin, X } from "lucide-react";

export default function FilterDropdownModal({
  category,
  setCategory,
  propertyType,
  setPropertyType,
  setTown,
  rooms,
  setRooms,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  showFilters,
  setShowFilters,

  clearAllFilters,
  activeFilterCount,
  customTown,
  setCustomTown,
}) {
  const [selectedTown, setSelectedTown] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectQuery, setSelectQuery] = useState("");

  const options = [
    ...cities.map((city) => ({ value: city, label: city })),
    { value: "other", label: "Other (please specify)" },
  ];

  const filteredOptions = options
    .filter((opt) =>
      opt.label.toLowerCase().includes(selectQuery.toLowerCase())
    )
    .slice(0, 10);

  const handleSelect = (option) => {
    setSelectedTown(option);
    setDropdownOpen(false);
    setSelectQuery(option.value === "other" ? "" : option.label);
    if (option.value !== "other") setCustomTown("");
    setTown(option.value === "other" ? customTown : option.value);
  };

  const propertyTypes = {
    residential: [
      { value: "studio", label: "Studio", icon: "🏠" },
      { value: "apartment", label: "Apartment", icon: "🏢" },
      { value: "duplex", label: "Duplex", icon: "🏡" },
      { value: "bungalow", label: "Bungalow", icon: "🌴" },
      { value: "villa", label: "Villa", icon: "🏰" },
    ],
    commercial: [
      { value: "office", label: "Office", icon: "💼" },
      { value: "shop", label: "Shop", icon: "🛍️" },
      { value: "warehouse", label: "Warehouse", icon: "🏭" },
      { value: "land", label: "Land", icon: "🌳" },
    ],
  };
  return (
    <>
      <div
        className={`
            fixed inset-x-4 top-20 sm:top-24 sm:inset-x-auto sm:absolute sm:top-full 
            left-0 right-0 sm:left-auto sm:right-auto sm:max-w-4xl w-full mx-auto 
            bg-white rounded-xl shadow-lg border border-gray-200 z-50 transition-all duration-300
            ${
              showFilters
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }
          `}
      >
        {/* Filter Header */}
        <div className="px-6 py-4 border-b border-gray-100 ">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <p className="text-gray-600 text-sm mt-0.5">
                Refine your property search
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-6 max-h-[77vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCategory("")}
                  className={`flex-1 py-2.5 px-3 rounded-lg border text-sm text-center transition-all font-medium ${
                    category === ""
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setCategory("residential")}
                  className={`flex-1 py-2.5 px-3 rounded-lg border text-sm text-center transition-all font-medium ${
                    category === "residential"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Residential
                </button>
                <button
                  onClick={() => setCategory("commercial")}
                  className={`flex-1 py-2.5 px-3 rounded-lg border text-sm text-center transition-all font-medium ${
                    category === "commercial"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Commercial
                </button>
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="space-y-3 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {(category
                  ? propertyTypes[category]
                  : [...propertyTypes.residential, ...propertyTypes.commercial]
                ).map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setPropertyType(type.value)}
                    className={`py-2.5 px-3 rounded-lg border text-sm transition-all font-medium flex items-center justify-center space-x-2 ${
                      propertyType === type.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-base">{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-3 w-full sm:w-72">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>

              {/* Dropdown wrapper */}
              <div className="relative">
                {/* Select input */}
                <div
                  className="border border-gray-300 rounded-lg px-10 py-2 flex justify-between items-center cursor-pointer hover:border-indigo-500 transition-colors bg-white"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {/* MapPin icon */}
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />

                  {/* Selected value */}
                  <span
                    className={`truncate ${
                      selectedTown ? "text-black" : "text-gray-400"
                    }`}
                    title={
                      selectedTown
                        ? selectedTown.value === "other"
                          ? "Other (please specify)"
                          : selectedTown.label
                        : "Select a town/city..."
                    }
                  >
                    {selectedTown
                      ? selectedTown.value === "other"
                        ? "Other (please specify)"
                        : selectedTown.label
                      : "Select a town/city..."}
                  </span>

                  <span className="ml-2 text-gray-400">▼</span>
                </div>

                {/* Dropdown list */}
                {dropdownOpen && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                    {/* Search input */}
                    <input
                      type="text"
                      value={selectQuery}
                      onChange={(e) => setSelectQuery(e.target.value)}
                      placeholder="Type to search..."
                      className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-t-lg"
                      autoFocus
                    />

                    {/* Options */}
                    <div className="max-h-40 overflow-y-auto">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className={`px-3 py-2 cursor-pointer transition-colors ${
                              option.value === selectedTown?.value
                                ? "bg-indigo-100 font-medium"
                                : "hover:bg-indigo-50"
                            }`}
                          >
                            {option.label}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500">
                          No options found
                        </div>
                      )}

                      {/* "Other" option */}
                      <div
                        onClick={() =>
                          handleSelect({ value: "other", label: "Other" })
                        }
                        className={`px-3 py-2 cursor-pointer font-medium transition-colors ${
                          selectedTown?.value === "other"
                            ? "bg-indigo-100"
                            : "hover:bg-indigo-50"
                        }`}
                      >
                        Other (please specify)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom "Other" input (separate container!) */}
              {selectedTown?.value === "other" && (
                <div className="relative mt-2">
                  <input
                    type="text"
                    value={customTown}
                    onChange={(e) => {
                      setCustomTown(e.target.value);
                      setTown(e.target.value); // update town filter immediately
                    }}
                    placeholder="Enter custom town..."
                    className="block w-full rounded-lg border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Rooms Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Rooms
              </label>
              <select
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm appearance-none bg-white"
              >
                <option value="">Any rooms</option>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Room" : "Rooms"}+
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Price Range (FCFA)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 font-medium">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="Minimum"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 font-medium">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="Maximum"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-100 gap-2">
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium order-2 sm:order-1"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium order-1 sm:order-2"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
