import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Share2, X } from "lucide-react";
import { useSwipeable } from "react-swipeable";

export default function PropertyImages({ property, setIsShareModalOpen }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // --- Prepare images ---
  const images =
    Array.isArray(property.propertyImages) && property.propertyImages.length > 0
      ? property.propertyImages
      : [{ url: "https://via.placeholder.com/400x300?text=No+Image" }];

  // --- Overlay prev/next handlers ---
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // --- Swipe handlers ---
  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="mt-6">
      {/* Title + Share */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-700 text-lg">
            {property.title}
          </h3>
          <p className="text-gray-500 text-sm">
            {property.town}, {property.neighbourhood}
          </p>
        </div>
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

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-4 h-[500px] relative">
        <div
          className="relative w-full h-[500px] md:col-span-3 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => {
            setCurrentIndex(0);
            setIsOverlayOpen(true);
          }}
        >
          <img
            src={images[0].url}
            alt="Main Property"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-rows-2 grid-cols-2 gap-4 md:col-span-2 h-[500px] relative">
          {images.slice(1, 5).map((img, index) => (
            <div
              key={index}
              className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer"
              onClick={() => {
                setCurrentIndex(index + 1);
                setIsOverlayOpen(true);
              }}
            >
              <img
                src={img.url}
                alt={`Property ${index + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* "View More" button overlay */}
          {images.length > 1 && (
            <button
              className="absolute bottom-3 right-3 bg-black/50 text-white font-medium px-4 py-2 rounded-full shadow-md hover:bg-black/40 transition-colors text-sm md:text-base"
              onClick={() => setIsOverlayOpen(true)}
            >
              View More
            </button>
          )}
        </div>
      </div>

      {/* Mobile carousel */}
      <div
        className="md:hidden relative w-full h-64 rounded-lg overflow-hidden cursor-pointer"
        {...handlers}
        onClick={() => setIsOverlayOpen(true)}
      >
        <img
          src={images[currentIndex].url}
          alt={`Property ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
        />

        {/* Prev button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full hover:bg-gray-800/70 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full hover:bg-gray-800/70 transition-colors"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentIndex ? "bg-white" : "bg-gray-400/50"
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* Full screen overlay */}
      {isOverlayOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white p-2 z-50"
            onClick={() => setIsOverlayOpen(false)}
          >
            <X size={28} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/50 text-white p-3 rounded-full hover:bg-gray-800/70 transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <ChevronLeft size={32} />
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center"
            {...handlers}
          >
            <img
              src={images[currentIndex].url}
              alt={`Expanded Property ${currentIndex + 1}`}
              className="w-auto max-h-full lg:rounded-lg object-contain"
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/50 text-white p-3 rounded-full hover:bg-gray-800/70 transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
