import { useState, useContext } from "react";
import { Menu, X, Bell, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CamirentLogo from "../images/Camirent_Logo.png";

export default function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [active, setActive] = useState("Dashboard");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const menuItems = [
    { name: "Dashboard", to: "/admin/dashboard" },
    { name: "Users", to: "/admin/users" },
    { name: "Properties", to: "/admin/properties" },
    { name: "Requests", to: "/admin/requests" },
    { name: "Support", to: "/admin/support" },
  ];

  const toggleSubmenu = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const closeMenu = () => setMenuOpen(false);

  const Btn = ({ children, className = "", route, ...props }) => {
    const handleClick = () => {
      if (route) navigate(route);
      if (props.onClick) props.onClick();
    };

    return (
      <button
        {...props}
        onClick={handleClick}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out hover:scale-105 ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 w-full bg-white text-black shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 lg:py-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold text-[#5617eb]">
            <img
              className="h-auto w-32 sm:w-32 md:w-40"
              src={CamirentLogo}
              alt="Camirent Logo"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              onClick={() => setActive(item.name)}
              className={`py-2 transition-colors duration-200 ${
                active === item.name
                  ? "text-indigo-700 font-semibold"
                  : "hover:text-indigo-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          {user ? (
            <>
              <button className="relative p-2 hover:text-indigo-700 transition-colors group">
                <Bell size={22} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link to="/profile">
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-700 text-white font-bold group-hover:scale-110 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-medium">
                    {user.name.split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Btn
                route="/login"
                className="border border-black text-black hover:bg-black hover:text-white flex items-center gap-2"
              >
                Login
              </Btn>
              <Btn
                route="/signup"
                className="bg-indigo-700 text-white hover:bg-indigo-800 shadow-md hover:shadow-lg"
              >
                Sign Up
              </Btn>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40">
          <div className="flex items-center justify-between p-4 border-b border-black/10">
            <span className="text-xl font-bold">Menu</span>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                onClick={() => {
                  setActive(item.name);
                  closeMenu();
                }}
                className={`block py-4 font-medium transition-colors ${
                  active === item.name
                    ? "text-indigo-700 font-semibold"
                    : "hover:text-indigo-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray/20">
            {user ? (
              <Link
                to="/profile"
                onClick={closeMenu}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-700 text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">
                    {user.name.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <p className="text-sm text-black/80">{user.email}</p>
                </div>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Btn
                  route="/login"
                  onClick={closeMenu}
                  className="border border-black text-black hover:bg-black hover:text-white text-center"
                >
                  Login
                </Btn>
                <Btn
                  route="/signup"
                  onClick={closeMenu}
                  className="bg-indigo-700 text-white hover:bg-indigo-700 text-center"
                >
                  Sign Up
                </Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
