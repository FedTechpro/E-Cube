// PropertyDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Facebook, LinkIcon, Loader2, MessageSquare, Send } from "lucide-react";
import PropertyImages from "../components/PropertyImages";
import { Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MessageLandlordButton from "../components/MessageLandlordButton";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        // Mock API call
        const res = await fetch(`http://localhost:4000/api/properties/${id}`);
        if (!res.ok) {
          throw new Error("Property not found");
        }
        const data = await res.json();
        setProperty(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-gray-700" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500 font-medium">{error}</div>
    );
  }

  if (!property) {
    return (
      <div className="text-center mt-20 text-gray-700 font-medium">
        Property not found
      </div>
    );
  }

  // Mock specifications if not available
  const mockSpecsCommercial = {
    rooms: property.specifications?.sections || "NA",
    area: property.specifications?.area || "NA",
    toilets: property.specifications?.toilets || "NA",
    distanceFromRoad: property.specifications?.distanceFromRoad || "NA",
    caution: property.caution || 0,
  };

  const mockSpecsResidential = {
    rooms: property.specifications?.bedrooms || "NA",
    kitchens: property.specifications?.kitchens || "NA",
    toilets: property.specifications?.toilets || "NA",
    livingRooms: property.specifications?.livingRooms || 0,
    area: property.specifications?.size || "NA",
    distanceFromRoad: property.specifications?.distanceFromRoad || "NA",
    caution: property.caution || 0,
  };

  const specs =
    property.category.toLowerCase() === "commercial"
      ? mockSpecsCommercial
      : mockSpecsResidential;

  return (
    <div className=" mx-auto mb-20">
      {/* Images */}
      {property.propertyImages && property.propertyImages.length > 0 && (
        <PropertyImages
          setIsShareModalOpen={setIsShareModalOpen}
          property={property}
        />
      )}
      {/* Title, Location, Price & Share */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {property.title}
          </h1>
          <p className="text-gray-500 mt-1">
            {property.town}, {property.neighbourhood}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <span className="text-indigo-700 font-semibold text-lg">
            {property.price?.toLocaleString()} FCFA/{property.paymentTerms}
          </span>
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsShareModalOpen(true);
            }}
          >
            <Share2 size={20} className="text-gray-700" />
          </button>
        </div>
      </div>
      {/* Property Specifications */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Specifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(specs).map(([key, value]) => {
            let displayValue = value;

            // Append units
            if (key.toLowerCase() === "caution")
              displayValue = `${value.toLocaleString()} FCFA`;
            if (key.toLowerCase().includes("distancefromroad"))
              displayValue = `${value} mins`;

            return (
              <div key={key} className="flex justify-between border-b py-2">
                <span className="capitalize text-gray-600">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="font-medium text-gray-800">
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-700 mb-2">Description</h2>
        <p className="text-gray-600">
          {property.description || "No description available."}
        </p>
      </div>
      {/* Property Info */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Other Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700">Category</h3>
            <p className="text-gray-600">{property.category}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Property Type</h3>
            <p className="text-gray-600">{property.propertyType}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Location</h3>
            <p className="text-gray-600">{property.town}</p>
          </div>
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize hover:bg-indigo-100 transition-colors"
                  >
                    {amenity.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-medium text-lg mb-4">Share this property</h3>
            <div className="grid grid-cols-2 gap-4">
              <a
                href={`https://wa.me/?text=Check out this property: ${window.location.origin}/property-details/${property._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
              >
                <MessageSquare size={24} />
                <span className="mt-2 text-sm">WhatsApp</span>
              </a>
              <a
                href={`https://t.me/share/url?url=${window.location.origin}/property-details/${property._id}&text=Check out this property`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                <Send size={24} />
                <span className="mt-2 text-sm">Telegram</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/property-details/${property._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                <Facebook size={24} />
                <span className="mt-2 text-sm">Facebook</span>
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/property-details/${property._id}`
                  );
                  // You might want to add a toast notification here
                  setIsShareModalOpen(false);
                }}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <LinkIcon size={24} />
                <span className="mt-2 text-sm">Copy Link</span>
              </button>
            </div>
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="mt-4 w-full py-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <MessageLandlordButton
        propertyTitle={property.title}
        authorWhatsApp={property.author.whatsapp}
      />
    </div>
  );
}
