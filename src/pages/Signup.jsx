// src/components/Signup.jsx
import React, { useContext, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { saveUser, saveSession, getUsers } from "../utils/auth"; // Assume you have an API utility for authentication
import { AuthContext } from "../context/authContext";
export default function Signup() {
  const { user, setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  function handleCheckboxChange(e) {
    setAgreed(e.target.checked); // true or false
    console.log("Agreed to terms:", e.target.checked);
  }

  async function handleSignup(e) {
    // Implement signup logic here
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      alert(message);
      return;
    }
    if (!agreed) {
      alert("You must agree to the terms to sign up!");
      return;
    }
    const data = { email, password };

    if (getUsers().find((user) => user.email === email)) {
      setMessage("User with this email already exists!");
      alert(message);
      return;
    }

    saveUser(data);
    saveSession(data);
    setUser(data);
    setSigningUp(true);

    await setTimeout(() => {
      setSigningUp(false);
      navigate("/");
    }, 2000);

    console.log(user);
    console.log(getUsers());

    wipeSignupForm();
  }

  function wipeSignupForm() {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col ">
      {/* Navigation */}

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#2A2A2A] rounded-xl p-8 shadow-lg border border-[#3A3A3A]">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
              <p className="text-gray-400 text-sm">
                Join MovieFlix to access thousands of movies and shows
              </p>
            </div>

            <form className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E2383F] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    id="password"
                    name="password"
                    className="w-full bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E2383F] focus:border-transparent transition-all pr-10"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#E2383F] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Must be at least 8 characters with one number and one special
                  character
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E2383F] focus:border-transparent transition-all pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#E2383F] transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start mt-6">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    checked={agreed}
                    onChange={handleCheckboxChange}
                    name="terms"
                    type="checkbox"
                    className="w-4 h-4 text-[#E2383F] bg-[#3A3A3A] border-[#4A4A4A] rounded focus:ring-[#E2383F] focus:ring-2"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-400">
                    I agree to the{" "}
                    <Link to="" className="text-[#E2383F] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="" className="text-[#E2383F] hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={(e) => handleSignup(e)}
                type="submit"
                className="w-full py-3 px-4 bg-[#E2383F] text-white rounded-lg font-medium hover:bg-[#D32F2F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E2383F] focus:ring-offset-2 focus:ring-offset-[#2A2A2A] mt-6"
              >
                {signingUp ? "Signing up..." : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#E2383F] hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
