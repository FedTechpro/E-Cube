import React, { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // If using React Router
import SideImage from "../components/SideImage";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { RedirectContext } from "../context/RedirectContext";

const LoginPage = () => {
  const { redirectPath, setRedirectPath } = useContext(RedirectContext);

  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      // Your login logic here
      console.log("Login attempt:", formData);
      const loggedInUser = await login(formData.email, formData.password);

      // only navigate after user is set
      if (loggedInUser) {
        navigate(redirectPath || "/");
        setRedirectPath(null);
      }
      // Handle successful login
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
      console.log(user);
    }
  };

  useEffect(() => {
    console.log("User in useEffect", user);
  }, [user]);

  return (
    <div className="min-h-screen flex  mx-auto w-full max-w-7xl">
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-top px-4 sm:px-6 lg:px-0 lg:pr-20">
        <div className="mx-auto w-full mt-7">
          {/* Back Button */}
          <Link
            to="/" // Update with your actual route
            className="inline-flex items-center text-gray-600 hover:text-indigo-700 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"></div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className="text-sm text-indigo-700 hover:text-indigo-800 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent transition-all placeholder-gray-400 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-indigo-700 border-gray-300 rounded focus:ring-indigo-700"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-700 text-white py-3 px-4 rounded-lg hover:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign in
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup" // Update with your actual signup route
                  className="text-indigo-700 hover:text-indigo-800 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section - Hidden on small screens */}
      <SideImage />
    </div>
  );
};

export default LoginPage;
