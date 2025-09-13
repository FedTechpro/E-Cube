// src/components/Login.jsx
import React, { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/authContext";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col ">
      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center mt-[-60px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#2A2A2A] rounded-xl p-8 shadow-lg border border-[#3A3A3A]">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-400 text-sm">
                Sign in to continue to your MovieFlix account
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-[#E2383F]/20 border border-[#E2383F]/30 rounded-lg text-sm text-[#E2383F]"
              >
                {error}
              </motion.div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E2383F] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E2383F] focus:border-transparent transition-all pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#E2383F] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#E2383F] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#E2383F] text-white rounded-lg font-medium hover:bg-[#D32F2F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E2383F] focus:ring-offset-2 focus:ring-offset-[#2A2A2A] mt-2"
              >
                Sign In
              </button>
            </form>

            {/* Demo Account Hint */}
            <div className="mt-6 p-4 bg-[#3A3A3A]/50 rounded-lg border border-[#4A4A4A]">
              <p className="text-xs text-gray-400 text-center">
                For demo purposes, use any account you've previously created
                through the signup page.
              </p>
            </div>

            {/* Signup Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#E2383F] hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
