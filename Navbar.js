import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <nav className="w-full bg-green-900 py-4 fixed top-0 left-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <h1 className="text-white font-bold text-2xl cursor-pointer" onClick={() => navigate("/")}>
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

        {/* Register/Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="ml-6 bg-yellow-500 text-green-900 font-semibold px-5 py-2 rounded-full shadow hover:bg-yellow-400 transition"
        >
          Register / Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
