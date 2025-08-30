// src/pages/EditProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: "",
    contact: "",
    preferences: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing details from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setForm({
      address: user.address || "",
      contact: user.contact || "",
      preferences: user.preferences || "",
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...user, ...form };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/donor/profile"), 1000);
    } catch (err) {
      setError("Failed to save changes.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Edit Profile
        </h2>
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3 text-center">{success}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          <input
            type="text"
            name="preferences"
            value={form.preferences}
            onChange={handleChange}
            placeholder="Preferences (optional)"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-900 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;