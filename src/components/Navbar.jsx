import { useContext, useMemo, useState } from "react";
import { Menu, X, Bell, LogIn, ChevronRight, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CamirentLogo from "../images/Camirent_Logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const baseMenuItems = [
    { name: "Home", to: "/" },
    { name: "Post property", to: "/post-property" },
    {
      name: "Support",
      children: [
        { name: "FAQ", to: "/faq" },
        { name: "Contact", to: "/contact" },
        { name: "Help Center", to: "/help" },
      ],
    },
    {
      name: "Resources",
      children: [
        { name: "Blog", to: "/blog" },
        { name: "Guides", to: "/guides" },
        { name: "About", to: "/about" },
      ],
    },
    { name: "My Listings", to: "/my-listings" },
  ];

  // Compute menu dynamically
  const menuItems = useMemo(() => {
    return baseMenuItems
      .filter((item) => {
        if (item.name === "My Listings") {
          return user?.role === "landlord" || user?.role === "caretaker";
        }
        return true;
      })
      .concat(
        user?.role === "admin"
          ? [{ name: "Admin Dashboard", to: "/admin/dashboard" }]
          : []
      );
  }, [user]);

  const toggleSubmenu = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const closeMenu = () => setMenuOpen(false);

  const Btn = ({ children, className = "", route, ...props }) => {
    const handleClick = () => {
      if (route) {
        navigate(route); // navigate to the given route
      }
      if (props.onClick) {
        props.onClick(); // call any other onClick passed
      }
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
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-[#5617eb]">
              <img
                className="h-auto w-32 sm:w-32 md:w-40 "
                src={CamirentLogo}
                alt="Camirent Logo"
              />
            </Link>
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.name} className="relative group">
                <button className="hover:text-indigo-700 flex items-center gap-1 transition-colors duration-200 py-2">
                  {item.name}
                  <ChevronRight
                    size={14}
                    className="group-hover:rotate-90 transition-transform"
                  />
                </button>
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-white text-black shadow-xl rounded-lg overflow-hidden min-w-[180px] border border-gray-100">
                  {item.children.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.to}
                      onClick={() => setActive(sub.name)}
                      className={`block px-6 py-3 transition-colors duration-150 ${
                        active === sub.name
                          ? "bg-indigo-700 text-white font-semibold"
                          : "hover:bg-indigo-700 hover:text-white"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
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
            )
          )}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          {user ? (
            <>
              <button className="relative p-2 hover:text-indigo-700 transition-colors group">
                <Bell size={22} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-indigo-700 group-hover:w-4 transition-all duration-200"></span>
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
                <LogIn size={16} /> Login
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

        {/* Right side (Mobile tutor button + menu toggler) */}
        <div className="lg:hidden flex items-center gap-2">
          {!menuOpen && (
            <button
              onClick={() => {
                setActive("Become a tutor");
                navigate("/post-property");
              }}
              className="border border-black text-black flex items-center justify-center gap-1 text-sm px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full"
            >
              Post Property <ChevronRight size={16} />
            </button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <span className="text-xl font-bold">Menu</span>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu items */}
          <div className="p-4 space-y-1">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="border-b border-black/10 last:border-b-0"
              >
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className="w-full flex items-center justify-between py-4 text-left hover:text-indigo-700 transition-colors"
                    >
                      <span className="font-medium">{item.name}</span>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform ${
                          expandedItems[item.name] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedItems[item.name] && (
                      <div className="pl-4 pb-2 space-y-2">
                        {item.children.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.to}
                            onClick={() => {
                              setActive(sub.name);
                              closeMenu();
                            }}
                            className={`block py-2 transition-colors ${
                              active === sub.name
                                ? "text-indigo-700 font-semibold"
                                : "text-black/90 hover:text-indigo-700"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
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
                )}
              </div>
            ))}
          </div>

          {/* Mobile auth section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray/10 border-t border-gray/20">
            {user ? (
              <Link
                to="/profile"
                onClick={closeMenu}
                className="flex items-center"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-700 text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.name.split(" ").slice(0, 2).join(" ")}
                    </p>

                    <p className="text-sm text-black/80">{user.email}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Btn
                  route="/login"
                  onClick={closeMenu}
                  className="border border-black text-black hover:bg-black hover:text-black text-center"
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
