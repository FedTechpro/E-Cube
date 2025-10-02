import { MapPin, Star, MessageCircle, Award } from "lucide-react";
import { Link } from "react-router-dom";

export default function TutorCard({ tutor }) {
  return (
    <Link to={`/tutor-profile/${tutor.id}`}>
      {" "}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 w-full cursor-pointer border border-gray-100 hover:border-[#4CA771]/20 group">
        <div className="flex gap-5">
          {/* Left Section - Tutor Image & Rating */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={tutor.image}
                alt={tutor.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm group-hover:shadow-md transition-shadow"
              />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-sm flex items-center">
                <Star
                  size={12}
                  fill="#FFB525"
                  className="text-[#FFB525] mr-1"
                />
                <span className="text-xs font-semibold text-gray-700">
                  {tutor.rating}
                </span>
              </div>
            </div>

            <div className="mt-5 text-center">
              <div className="text-[#4CA771] font-bold text-lg">
                {tutor.rate} F/hr
              </div>
              <div className="text-xs text-gray-500 mt-1">Starting from</div>
            </div>
          </div>

          {/* Right Section - Content */}
          <div className="flex-1 min-w-0">
            {/* Name and specialties */}
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-gray-900 text-lg truncate">
                {tutor.name}
              </h3>
              <Award size={18} className="text-[#FFB525] flex-shrink-0 ml-2" />
            </div>

            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin size={14} className="text-[#4CA771] mr-1 flex-shrink-0" />
              <span className="truncate">{tutor.location}</span>
            </div>

            <p className="text-gray-600 text-sm mt-3 line-clamp-2">
              Specializes in {tutor.specialties.join(", ")}
            </p>

            {/* Reviews and action indicator */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center text-gray-500 text-sm">
                <MessageCircle size={14} className="mr-1" />
                <span>{tutor.reviews || 16} reviews</span>
              </div>

              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[#4CA771] animate-pulse mr-2"></div>
                <span className="text-xs text-[#4CA771] font-medium">
                  Available Today
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
