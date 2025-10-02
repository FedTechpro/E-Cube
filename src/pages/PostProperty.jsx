import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Home,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Check,
  X,
  //   Plus,
  //   Trash2,
  Eye,
  Bold,
  List,
  Type,
  ArrowLeft,
  ArrowRight,
  Upload,
  Edit3,
  Ruler,
  CheckCircle,
} from "lucide-react";
import { compressImage } from "../util/ImageUploader";
import cities from "../data/cities.json";
import { AuthContext } from "../context/AuthContext";

export default function Postproperty() {
  const location = useLocation();
  const passedID = location.state;
  const { user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [posting, setPosting] = useState(false);
  const [selectedTownOption, setSelectedTownOption] = useState(null);

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    category: "",
    propertyType: "",
    location: {
      country: "",
      town: "",
      neighbourhood: "",
    },
    title: "",
    paymentTerm: "",
    price: "",
    caution: "",
    description: "",
    availability: "",
    userId: "",
    amenities: [],
    propertyImages: [],
    specifications: {
      // Residential specifications
      bedrooms: "",
      toilets: "",
      kitchens: "",
      livingRooms: "",
      size: "",
      distanceFromRoad: "",
      // Commercial specifications
      sections: "",
      // Shared
    },
  });

  //   const [descriptionFormat, setDescriptionFormat] = useState("p");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const steps = [
    { number: 1, label: "Category", icon: Home },
    { number: 2, label: "Location", icon: MapPin },
    { number: 3, label: "Specifications", icon: Ruler },
    { number: 4, label: "Details", icon: Edit3 },
    { number: 5, label: "Pricing", icon: DollarSign },
    { number: 6, label: "Amenities", icon: Check },
    { number: 7, label: "Media", icon: ImageIcon },
    { number: 8, label: "Preview", icon: Eye },
  ];

  const categories = {
    residential: {
      label: "Residential",
      types: ["studio", "apartment", "duplex", "bungalow", "villa"],
    },
    commercial: {
      label: "Commercial",
      types: ["office", "shop", "warehouse", "land"],
    },
  };

  const amenitiesList = [
    { value: "water", label: "Water", icon: "💧" },
    { value: "electricity", label: "Electricity", icon: "⚡" },
    { value: "internet", label: "Internet", icon: "🌐" },
    { value: "parking", label: "Parking", icon: "🚗" },
    { value: "security", label: "Security", icon: "🔒" },
    { value: "furnished", label: "Furnished", icon: "🛋️" },
    { value: "ac", label: "Air Conditioning", icon: "❄️" },
    { value: "balcony", label: "Balcony", icon: "🏙️" },
    { value: "swimming_pool", label: "Swimming Pool", icon: "🏊" },
    { value: "gym", label: "Gym", icon: "💪" },
  ];

  const handleInputChange = (path, value) => {
    if (path.includes(".")) {
      const [parent, child] = path.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [path]: value,
      }));
    }
  };

  // Town Input
  const filteredCities = cities
    .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10); // limit to 10 results

  const handleSelect = (value) => {
    if (value === "other") {
      setIsOtherSelected(true);
      setQuery("Other (please specify)");
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, town: "" },
      }));
    } else {
      setIsOtherSelected(false);
      setQuery(value);
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, town: value },
      }));
    }
    setShowDropdown(false);
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (formData.propertyImages.length + files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    for (let file of files) {
      const { compressedFile, previewUrl } = await compressImage(file);

      // save compressed file for backend
      setFormData((prev) => ({
        ...prev,
        propertyImages: [...prev.propertyImages, compressedFile],
      }));

      // save preview
      setImagePreviews((prev) => [
        ...prev,
        {
          url: previewUrl,
          name: compressedFile.name || file.name,
          id: Math.random().toString(36).substr(2, 9),
        },
      ]);
    }
  };

  const handleImageDelete = (id) => {
    const imgToRemove = imagePreviews.find((img) => img.id === id);

    setImagePreviews((prev) => prev.filter((img) => img.id !== id));

    setFormData((prev) => ({
      ...prev,
      propertyImages: prev.propertyImages.filter(
        (file) => file.name !== imgToRemove.name
      ),
    }));
  };

  const formatDescription = (type) => {
    const textarea = document.getElementById("description");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.description.substring(start, end);

    let formattedText = "";

    switch (type) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "bullet":
        formattedText = selectedText
          .split("\n")
          .map((line) => (line ? `• ${line}` : ""))
          .join("\n");
        break;
      case "p":
        formattedText = selectedText;
        break;
      default:
        formattedText = selectedText;
    }

    const newDescription =
      formData.description.substring(0, start) +
      formattedText +
      formData.description.substring(end);

    handleInputChange("description", newDescription);
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const resetForm = () => {
    setFormData({
      category: "",
      propertyType: "",
      location: {
        country: "",
        town: "",
        neighbourhood: "",
      },
      title: "", //Editable
      paymentTerm: "", //Editable
      price: "", //Editable
      caution: "", //Editable
      description: "", //Editable
      amenities: [], //Editable
      propertyImages: [],
      availability: "",
      specifications: {
        bedrooms: "",
        toilets: "",
        kitchens: "",
        livingRooms: "",
        size: "",
        distanceFromRoad: "",
        sections: "",
      },
    });
    setImagePreviews([]);
    setCurrentStep(1);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    resetForm();
  };

  async function handlePropertySubmit(e) {
    e.preventDefault();
    setPosting(true);

    try {
      const data = new FormData();

      // Append primitive fields
      data.append("category", formData.category);
      data.append("propertyType", formData.propertyType);
      data.append("title", formData.title);
      data.append("paymentTerm", formData.paymentTerm);
      data.append("price", formData.price);
      data.append("caution", formData.caution);
      data.append("description", formData.description);
      data.append("availability", formData.availability);

      // Append location (flattened)
      Object.entries(formData.location).forEach(([key, value]) => {
        data.append(`location[${key}]`, value);
      });

      // Append specifications (flattened)
      Object.entries(formData.specifications).forEach(([key, value]) => {
        data.append(`specifications[${key}]`, value);
      });

      // Append amenities
      data.append("amenities", JSON.stringify(formData.amenities));

      // Append compressed image files
      formData.propertyImages.forEach((file, index) => {
        const uniqueName = `${Date.now()}_${index}_${file.name}`;
        data.append("propertyImages", file, uniqueName);
      });

      // 🔥 Example POST to backend
      const response = await fetch("http://localhost:4000/api/property/post", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to submit property");
      }

      const result = await response.json();
      console.log("Property submitted successfully:", result);
      setPosting(false);
      resetForm();

      // Show success modal instead of alert
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting property:", error);
      alert("Failed to submit property. Please try again.");
      setPosting(false);
    }
  }

  // ... rest of your component code (renderStepContent, isStepValid, etc.) remains the same

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Only show if logged in user is admin */}
            {user?.role === "admin" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post on behalf of (User ID)
                </label>
                <input
                  type="text"
                  placeholder="Enter user ID"
                  value={passedID || ""}
                  onChange={(e) => handleInputChange("userId", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              Property Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categories).map(([key, category]) => (
                <div key={key} className="space-y-3">
                  <button
                    onClick={() => handleInputChange("category", key)}
                    className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                      formData.category === key
                        ? "border-indigo-700 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-400"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">
                      {category.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.types
                        .map(
                          (type) => type.charAt(0).toUpperCase() + type.slice(1)
                        )
                        .join(", ")}
                    </p>
                    {formData.category === key && (
                      <Check className="w-5 h-5 text-indigo-700 mt-2" />
                    )}
                  </button>

                  {formData.category === key && (
                    <div className="grid grid-cols-2 gap-2">
                      {category.types.map((type) => (
                        <button
                          key={type}
                          onClick={() =>
                            handleInputChange("propertyType", type)
                          }
                          className={`p-3 border rounded text-sm transition-all ${
                            formData.propertyType === type
                              ? "border-indigo-700 bg-indigo-700 text-white"
                              : "border-gray-200 hover:border-indigo-400"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Property Location
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {["country", "town", "neighbourhood"].map((field) =>
                field === "town" ? (
                  <div key={field} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Town/City*
                    </label>

                    {/* Searchable input */}
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-indigo-700 
                   focus:border-transparent"
                      placeholder="Search for a town..."
                    />

                    {/* Dropdown */}
                    {showDropdown && (
                      <ul
                        className="absolute z-10 w-full bg-white border border-gray-300 
                       rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg"
                      >
                        {filteredCities.map((city) => (
                          <li
                            key={city}
                            onClick={() => handleSelect(city)}
                            className="px-3 py-2 cursor-pointer hover:bg-indigo-100"
                          >
                            {city}
                          </li>
                        ))}
                        <li
                          onClick={() => handleSelect("other")}
                          className="px-3 py-2 cursor-pointer hover:bg-indigo-100 font-medium"
                        >
                          Other (please specify)
                        </li>
                      </ul>
                    )}

                    {/* If "Other", show input */}
                    {isOtherSelected && (
                      <div className="mt-2">
                        <input
                          type="text"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              location: {
                                ...prev.location,
                                town: e.target.value,
                              },
                            }))
                          }
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                 focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                          placeholder="Enter town/city name"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field}
                    </label>
                    <input
                      type="text"
                      defaultValue={field === "country" ? "Cameroon" : ""}
                      value={formData.location[field]}
                      onChange={(e) =>
                        handleInputChange(`location.${field}`, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Property Specifications
            </h2>

            {formData.category === "residential" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.specifications.bedrooms}
                    onChange={(e) =>
                      handleInputChange(
                        "specifications.bedrooms",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Toilets
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.specifications.toilets}
                    onChange={(e) =>
                      handleInputChange(
                        "specifications.toilets",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Kitchens
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.specifications.kitchens}
                    onChange={(e) =>
                      handleInputChange(
                        "specifications.kitchens",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Living Rooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.specifications.livingRooms}
                    onChange={(e) =>
                      handleInputChange(
                        "specifications.livingRooms",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.specifications.size}
                    onChange={(e) =>
                      handleInputChange("specifications.size", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance from Road (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.specifications.distanceFromRoad}
                    onChange={(e) =>
                      handleInputChange(
                        "specifications.distanceFromRoad",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            ) : formData.category === "commercial" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Sections
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.specifications.sections}
                    onChange={(e) =>
                      handleInputChange(
                        "specifications.sections",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Toilets
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.specifications.toilets}
                    onChange={(e) =>
                      handleInputChange(
                        "specifications.toilets",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size (m²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.specifications.size}
                    onChange={(e) =>
                      handleInputChange("specifications.size", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance from Road (meters)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.specifications.distanceFromRoad}
                    onChange={(e) =>
                      handleInputChange(
                        "specifications.distanceFromRoad",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Please select a property category first
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Property Details
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                placeholder="Enter property title"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <span className="text-sm text-gray-500">
                  {formData.description.length}/2000
                </span>
              </div>

              <div className="border border-gray-300 rounded-lg mb-2">
                <div className="flex border-b border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => formatDescription("bold")}
                    className="p-2 hover:bg-gray-100 rounded"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => formatDescription("bullet")}
                    className="p-2 hover:bg-gray-100 rounded"
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => formatDescription("p")}
                    className="p-2 hover:bg-gray-100 rounded"
                    title="Paragraph"
                  >
                    <Type className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={8}
                  className="w-full px-3 py-2 focus:outline-none resize-none"
                  placeholder="Describe your property in detail..."
                  maxLength={2000}
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={(e) =>
                  handleInputChange("availability", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
              >
                <option value="">Select availability</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Pricing & Terms
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Term
                </label>
                <div className="relative">
                  <select
                    value={formData.paymentTerm}
                    onChange={(e) =>
                      handleInputChange("paymentTerm", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent appearance-none"
                  >
                    <option value="">Select payment term</option>
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Price Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                    F
                  </span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Price in CFA francs
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Security Deposit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit (Caution)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                    F
                  </span>
                  <input
                    type="number"
                    value={formData.caution}
                    onChange={(e) =>
                      handleInputChange("caution", e.target.value)
                    }
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Refundable security deposit required
                </p>
              </div>
            </div>

            {/* Price Summary Preview */}
            {(formData.price || formData.caution) && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Price Summary
                </h4>
                <div className="space-y-2 text-sm">
                  {formData.price && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {formData.paymentTerm
                          ? `Price (${formData.paymentTerm})`
                          : "Price"}
                      </span>
                      <span className="font-medium">
                        F {parseFloat(formData.price).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {formData.caution && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-medium">
                        F {parseFloat(formData.caution).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {(formData.price || formData.caution) && (
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Initial Payment</span>
                        <span className="text-indigo-700">
                          F{" "}
                          {(
                            parseFloat(formData.caution || 0) +
                            (formData.paymentTerm === "monthly"
                              ? parseFloat(formData.price || 0)
                              : 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
            <p className="text-gray-600">
              Select all that apply to your property
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity.value}
                  onClick={() => handleAmenityToggle(amenity.value)}
                  className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center space-y-2 ${
                    formData.amenities.includes(amenity.value)
                      ? "border-indigo-700 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-400"
                  }`}
                >
                  <span className="text-2xl">{amenity.icon}</span>
                  <span className="text-sm font-medium">{amenity.label}</span>
                  {formData.amenities.includes(amenity.value) && (
                    <Check className="w-4 h-4 text-indigo-700" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Property Images
            </h2>
            <p className="text-gray-600">
              Upload up to 10 images of your property
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-3"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm font-medium text-indigo-700">
                  Click to upload images
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </span>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleImageDelete(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Preview Your Property
            </h2>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {imagePreviews.length > 0 && (
                <img
                  src={imagePreviews[0].url}
                  alt="Property preview"
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6 space-y-4">
                {/* Title + Price + Availability */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {formData.title || "No title"}
                    </h3>
                    <p className="text-indigo-700 font-semibold">
                      {formData.price
                        ? `${formData.price} FCFA/month`
                        : "No price"}
                    </p>
                  </div>

                  {formData.availability && (
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        formData.availability === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {formData.availability === "available"
                        ? "Available"
                        : "Rented"}
                    </span>
                  )}
                </div>
                {/* Location */}
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>
                    {[
                      formData.location.neighbourhood,
                      formData.location.town,
                      formData.location.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
                {/* Specifications, Description, Amenities (unchanged) */}
                ...
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.category && formData.propertyType;
      case 2:
        return Object.values(formData.location).every((val) => val.trim());
      case 3:
        // Only validate if category is selected
        if (!formData.category) return false;

        if (formData.category === "residential") {
          return (
            formData.specifications.bedrooms &&
            formData.specifications.toilets &&
            formData.specifications.size
          );
        } else if (formData.category === "commercial") {
          return (
            formData.specifications.sections && formData.specifications.size
          );
        }
        return false;
      case 4:
        return formData.title.trim() && formData.description.trim();
      case 5:
        return formData.price && formData.paymentTerm;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">
              Your property has been posted successfully.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleSuccessModalClose}
                className="flex-1 bg-indigo-700 text-white py-2 px-4 rounded-lg hover:bg-indigo-800 transition-colors"
              >
                Post Another Property
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Property
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Steps Indicator - Mobile */}
        <div className="lg:hidden border-b border-gray-200">
          <div className="flex overflow-x-auto px-4 py-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-center mx-2 min-w-[60px]"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number
                      ? "bg-indigo-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    currentStep === step.number
                      ? "text-indigo-700 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex">
          {/* Steps Sidebar - Desktop */}
          <div className="hidden lg:block w-64 border-r border-gray-200">
            <div className="sticky top-0 p-6 space-y-6">
              {steps.map((step) => {
                // const Icon = step.icon;
                return (
                  <button
                    key={step.number}
                    onClick={() => setCurrentStep(step.number)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      currentStep === step.number
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= step.number
                          ? "bg-indigo-700 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className="font-medium">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="p-4 lg:p-8">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={
                    currentStep === steps.length
                      ? (e) => handlePropertySubmit(e)
                      : nextStep
                  }
                  disabled={!isStepValid()}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-800 transition-colors"
                >
                  <span>
                    {currentStep === steps.length ? (
                      posting ? (
                        <span>Posting...</span>
                      ) : (
                        "Post Property"
                      )
                    ) : (
                      "Continue"
                    )}
                  </span>
                  {currentStep !== steps.length && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
