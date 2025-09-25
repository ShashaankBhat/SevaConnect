import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const DonorProfile = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
    preferences: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Update profile whenever user changes
  useEffect(() => {
    if (!loading && user) {
      setProfile({
        name: user?.name || "",
        email: user?.email || "",
        address: user?.address || "",
        contact: user?.contact || "",
        preferences: user?.preferences || "",
        city: user?.city || "",
        state: user?.state || "",
        pincode: user?.pincode || "",
      });
    }
  }, [user, loading]);

  if (loading)
    return <p className="text-center mt-20">Loading...</p>;

  if (!user)
    return (
      <p className="text-center mt-20 text-red-600">
        No user data found. Please login.
      </p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 pt-28">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Donor Profile
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Basic Information
          </h3>
          <input
            type="text"
            value={profile.name}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed mb-2"
          />
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Additional Details
          </h3>
          <input
            type="text"
            value={profile.address}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed mb-2"
          />
          <input
            type="text"
            value={profile.contact}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed mb-2"
          />
          <input
            type="text"
            value={profile.preferences}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed mb-2"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={profile.city}
              readOnly
              className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <input
              type="text"
              value={profile.state}
              readOnly
              className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <input
            type="text"
            value={profile.pincode}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed mt-2"
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