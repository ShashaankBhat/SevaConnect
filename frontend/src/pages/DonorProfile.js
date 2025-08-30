// src/pages/DonorProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DonorProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
    preferences: "",
  });

  // Load user profile from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (savedUser) {
      setUser({
        name: savedUser.name || "",
        email: savedUser.email || "",
        address: savedUser.address || "",
        contact: savedUser.contact || "",
        preferences: savedUser.preferences || "",
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 pt-28">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Donor Profile</h2>

        {/* Basic Info */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Basic Information</h3>
          <input
            type="text"
            value={user.name}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed mb-2"
          />
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Additional Info */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Additional Details</h3>
          <input
            type="text"
            value={user.address}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed mb-2"
          />
          <input
            type="text"
            value={user.contact}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed mb-2"
          />
          <input
            type="text"
            value={user.preferences}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          onClick={() => navigate("/donor/edit-profile")}
          className="w-full bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default DonorProfile;