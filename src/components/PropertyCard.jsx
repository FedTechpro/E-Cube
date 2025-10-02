// PropertyCard.jsx
import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  return (
    <Link to={`property-details/${property.id}`}>
      {" "}
      <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Property Image */}
        <img
          src={property.thumbnail || "/placeholder.jpg"}
          alt={property.title || "Property Image"}
          className="w-full h-48 object-cover"
        />

        {/* Property Details */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900">
            {property.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {property.town || "Unknown Location"},{" "}
            {property.neighbourhood || "N/A"}
          </p>
          <p className="text-indigo-700 font-semibold mt-2">
            F {property.price?.toLocaleString() || "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
}
