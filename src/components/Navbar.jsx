// src/components/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  X,
  ChevronRight,
  User,
  LogOut,
  Ticket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/authContext";
import Logo from "../images/E-Cube LOGO.png";

export default function Navbar({ searchActive, setSearchActive }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const styles = {
    dark: { bg: "[#0F0F0F]" },
    light: { bg: "[#FFFFFF]" },
  };

  return (
    <nav className="fixed top-0 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-3 flex items-center justify-between bg-[#0F0F0F] border-b border-[#2A2A2A] z-50 backdrop-blur-sm bg-opacity-95">
      {/* Logo */}
      <Link to="/" className="flex items-center group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-xl font-bold flex items-center"
        >
          <span className="mr-2 text-[#E2383F] text-3xl">
            <img src={Logo} alt="Logo" className="w-8 h-8" />
          </span>
          <span className="inline text-white font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#E2383F] to-[#FF6B6B]">
            E-Cube
          </span>
        </motion.div>
      </Link>

      {/* Large device nav */}
      <div className="hidden lg:flex items-center gap-8 flex-grow justify-center">
        {/* Search */}
        <motion.div
          className={`relative transition-all duration-300 ${
            searchFocused ? "w-2/4" : "w-2/5"
          }`}
          initial={false}
          animate={{ width: searchFocused ? "50%" : "40%" }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            onClick={() => setSearchActive(true)}
            type="text"
            readOnly
            placeholder="Search movies, shows..."
            className="w-full bg-[#1A1A1A] rounded-full pl-10 pr-4 py-2.5 outline-none border border-[#2A2A2A]  transition-all text-white placeholder-gray-500"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </motion.div>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          <NavLink to="/" text="Home" />
          <NavLink to="/my-tickets" text="My Tickets" />
          <NavLink to="/profile" text="Profile" />
        </div>
      </div>

      {/* User actions - large devices */}
      <div className="hidden lg:flex lg:relative gap-3 items-center">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E2383F] to-[#FF6B6B] flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-[#E2383F] transition-all shadow-md shadow-[#E2383F]/20"
            >
              {user?.email?.charAt(0).toUpperCase()}
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[#2A2A2A]">
                    <p className="text-sm font-medium text-white">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <DropdownButton
                      icon={<User size={16} />}
                      text="Profile"
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                    />
                    <DropdownButton
                      icon={<Ticket size={16} />}
                      text="My Tickets"
                      onClick={() => {
                        navigate("/my-tickets");
                        setDropdownOpen(false);
                      }}
                    />
                    <div className="h-px bg-[#2A2A2A] my-1"></div>
                    <DropdownButton
                      icon={<LogOut size={16} />}
                      text="Logout"
                      onClick={handleLogout}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-white rounded-full border border-[#3A3A3A] hover:border-[#E2383F] hover:text-[#E2383F] transition-all duration-200 font-medium flex items-center gap-1 text-[15px]"
            >
              Login <ChevronRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="px-5 py-2 bg-gradient-to-r from-[#E2383F] to-[#FF6B6B] text-white rounded-full hover:shadow-lg hover:shadow-[#E2383F]/30 transition-all duration-200 font-medium text-[15px]"
            >
              Sign Up
            </motion.button>
          </>
        )}
      </div>

      {/* Small devices nav */}
      <div className="flex lg:hidden items-center gap-3">
        {/* Search icon */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSearchActive(true)}
          className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors"
        >
          <Search className="w-5 h-5 text-gray-300" />
        </motion.button>

        {/* User actions */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-[#E2383F] to-[#FF6B6B] flex items-center justify-center text-white font-semibold shadow-md shadow-[#E2383F]/20"
            >
              {user?.email?.charAt(0).toUpperCase()}
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[#2A2A2A]">
                    <p className="text-sm font-medium text-white">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <DropdownButton
                      icon={<User size={16} />}
                      text="Profile"
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                    />
                    <DropdownButton
                      icon={<Ticket size={16} />}
                      text="My Tickets"
                      onClick={() => {
                        navigate("/my-tickets");
                        setDropdownOpen(false);
                      }}
                    />
                    <div className="h-px bg-[#2A2A2A] my-1"></div>
                    <DropdownButton
                      icon={<LogOut size={16} />}
                      text="Logout"
                      onClick={handleLogout}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signup")}
            className="px-4 py-1.5 bg-gradient-to-r from-[#E2383F] to-[#FF6B6B] text-white rounded-full text-sm font-medium shadow-md shadow-[#E2383F]/20"
          >
            Sign Up
          </motion.button>
        )}

        {/* Menu icon */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors"
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-gray-300" />
          ) : (
            <Menu className="w-5 h-5 text-gray-300" />
          )}
        </motion.button>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-[#1A1A1A] shadow-lg flex flex-col lg:hidden z-40 border-t border-[#2A2A2A] overflow-hidden"
          >
            <MobileNavLink
              to="/"
              text="Home"
              onClick={() => setMenuOpen(false)}
            />
            <MobileNavLink
              to="/my-tickets"
              text="My Tickets"
              onClick={() => setMenuOpen(false)}
            />
            <MobileNavLink
              to="/profile"
              text="Profile"
              onClick={() => setMenuOpen(false)}
            />

            {!user && (
              <>
                <div className="h-px bg-[#2A2A2A] my-1"></div>
                <MobileButton
                  text="Login"
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                />
                <MobileButton
                  text="Sign Up"
                  onClick={() => {
                    navigate("/signup");
                    setMenuOpen(false);
                  }}
                  highlighted
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Sub-components for cleaner code
const NavLink = ({ to, text }) => (
  <Link
    to={to}
    className="text-gray-300 hover:text-[#E2383F] transition-colors font-medium text-[15px] relative group"
  >
    {text}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E2383F] transition-all group-hover:w-full"></span>
  </Link>
);

const DropdownButton = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full px-3 py-2.5 text-sm text-gray-300 hover:text-[#E2383F] hover:bg-[#2A2A2A] rounded-md transition-colors flex items-center gap-3"
  >
    {icon}
    {text}
  </button>
);

const MobileNavLink = ({ to, text, onClick }) => (
  <Link
    to={to}
    className="px-6 py-4 text-gray-300 hover:text-[#E2383F] hover:bg-[#2A2A2A] transition-colors font-medium border-b border-[#2A2A2A]"
    onClick={onClick}
  >
    {text}
  </Link>
);

const MobileButton = ({ text, onClick, highlighted = false }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 text-left font-medium transition-colors border-b border-[#2A2A2A] ${
      highlighted
        ? "bg-gradient-to-r from-[#E2383F] to-[#FF6B6B] text-white"
        : "text-gray-300 hover:text-[#E2383F] hover:bg-[#2A2A2A]"
    }`}
  >
    {text}
  </button>
);
