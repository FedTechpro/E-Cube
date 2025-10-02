import React, { useState, useContext } from "react";
import {
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SideImage from "../components/SideImage";
import { AuthContext } from "../context/AuthContext";

const SignupPage = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    whatsapp: "",
    password: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const userRoles = [
    {
      value: "renter",
      title: "Renter",
      description:
        "Looking for a place to rent? Find your perfect home from our wide selection of properties.",
    },
    {
      value: "landlord",
      title: "Landlord",
      description:
        "List and manage your properties, find reliable tenants, and streamline your rental business.",
    },
    {
      value: "caretaker",
      title: "Caretaker",
      description:
        "Manage properties on behalf of owners and can rent out spaces to tenants.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const user = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.whatsapp,
        formData.agreeToTerms
      );

      if (user) setSuccessModal(true);
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-start px-4 sm:px-6 lg:px-12 py-8 lg:pr-20">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-indigo-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        {currentStep === 1 ? (
          // Step 1: Role Selection
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Join as a...
              </h2>
              <p className="text-gray-600">Select your role to get started</p>
            </div>

            <div className="space-y-4">
              {userRoles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleSelect(role.value)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-indigo-700 transition-all duration-200 hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900">{role.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {role.description}
                  </p>
                  <div className="flex justify-end mt-2">
                    <ChevronRight className="w-5 h-5 text-indigo-700" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Step 2: Registration Form
          <div className="space-y-6">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center text-gray-600 hover:text-indigo-700 transition-colors mb-2"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">Join as {formData.role}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-all"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="E.g: 674xxxxxx"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 9) {
                      handleInputChange({
                        target: { name: "whatsapp", value },
                      });
                    }
                  }}
                  pattern="\d{9}"
                  title="WhatsApp number must be exactly 9 digits"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 pr-10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-indigo-700 border-gray-300 rounded focus:ring-indigo-700"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-indigo-700 hover:text-indigo-800 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-indigo-700 hover:text-indigo-800 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!formData.agreeToTerms || loading}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.agreeToTerms
                    ? "bg-indigo-700 text-white hover:bg-indigo-800"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
            </form>

            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-700 hover:text-indigo-800 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Side Image */}
      <SideImage />

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative transform transition-transform scale-95 animate-fadeIn">
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-4 rounded-full mb-4">
                <Check className="h-10 w-10 text-indigo-700" />
              </div>

              <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">
                Signup Successful!
              </h2>

              <p className="text-gray-700 text-center mb-6">
                Welcome, <span className="font-medium">{formData.name}</span>!
                <br />
                {formData.role === "landlord" || formData.role === "caretaker"
                  ? `Our team will contact you soon on WhatsApp at ${formData.whatsapp} for verification.`
                  : `You can start browsing properties right away!`}
              </p>

              <button
                onClick={() => {
                  setSuccessModal(false);
                  navigate("/");
                }}
                className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-800 transition-colors font-semibold"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
