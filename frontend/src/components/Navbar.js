// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react"; // hamburger icon

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="w-full bg-green-900 py-4 fixed top-0 left-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <h1
          className="text-white font-bold text-2xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          SevaConnect
        </h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-grow max-w-2xl mx-6 flex items-center bg-white rounded-full shadow-lg overflow-hidden transition transform hover:scale-105"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NGOs..."
            className="flex-grow px-6 py-2 text-gray-800 text-lg focus:outline-none rounded-l-full"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-green-900 font-bold px-6 py-2 rounded-r-full hover:bg-yellow-400 transition text-lg"
          >
            Search
          </button>
        </form>

        {/* User Info / Dropdown */}
        {user ? (
          <div className="ml-6 relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white text-green-900 px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              <Menu size={20} />
              <span className="font-semibold">{user.name}</span>
              <span className="text-sm text-gray-600">
                ({user.entity.charAt(0).toUpperCase() + user.entity.slice(1)})
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-xl overflow-hidden z-50">
                <button
  onClick={() => navigate("/donor/profile")}
  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
>
  Profile
</button>
<button
  onClick={() => navigate("/donor/edit-profile")}
  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
>
  Edit Profile
</button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/donate");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  Donate Now
                </button>

                {/* NEW: Donor Dashboard Button */}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/donor/dashboard");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/donor/donation-history");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  My Donations
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/donor/suggested-ngos");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  Suggested NGOs
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="ml-6 bg-yellow-500 text-green-900 font-semibold px-5 py-2 rounded-full shadow hover:bg-yellow-400 transition"
          >
            Register / Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;