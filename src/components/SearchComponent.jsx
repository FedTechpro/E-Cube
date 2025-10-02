import { Search } from "lucide-react";

export default function SearchComponent({
  specialtyQuery,
  setSpecialtyQuery,
  locationQuery,
  setLocationQuery,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 justify-center">
      <div className="relative flex-1 max-w-2xl">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="What would you like to learn? (e.g., History, Graphic Design)"
          className="w-full pl-10 pr-4 py-2.5 border-b border-gray-200 focus:border-[#4CA771] focus:outline-none bg-transparent transition-colors duration-200 text-sm"
          value={specialtyQuery}
          onChange={(e) => setSpecialtyQuery(e.target.value)}
        />
      </div>
      <div className="relative flex-1 max-w-2xl">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by City/Town"
          className="w-full pl-10 pr-4 py-2.5 border-b border-gray-200 focus:border-[#4CA771] focus:outline-none bg-transparent transition-colors duration-200 text-sm"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
