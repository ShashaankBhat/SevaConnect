import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // reactive user
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Populate form based on user role
  useEffect(() => {
    if (!user) {
      setError("No user data found. Please login again.");
      setLoading(false);
      return;
    }
    if (user.role === "donor") {
      setFormData({
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        pincode: user?.pincode || "",
        preferences: user?.preferences || "",
      });
    } else if (user.role === "ngo") {
      setFormData({
        city: user?.city || "",
        state: user?.state || "",
        contact: user?.contact || "",
        status: user?.status || "",
      });
    } else if (user.role === "admin") {
      setFormData({
        adminRole: user?.adminRole || "",
      });
    }
    setLoading(false);
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Role-based validation
    if (user.role === "donor") {
      if (!formData.address || !formData.city || !formData.state) {
        setError("Address, City, and State are required.");
        return;
      }
      if (formData.pincode && !/^\d{5,6}$/.test(formData.pincode)) {
        setError("Pincode must be 5 or 6 digits.");
        return;
      }
      if (formData.preferences && formData.preferences.length > 500) {
        setError("Preferences should not exceed 500 characters.");
        return;
      }
    } else if (user.role === "ngo") {
      if (!formData.city || !formData.state || !formData.contact) {
        setError("City, State, and Contact are required for NGOs.");
        return;
      }
    } else if (user.role === "admin") {
      if (!formData.adminRole) {
        setError("Admin Role is required.");
        return;
      }
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/auth/${user.role}/${user.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      // Update user context with new data
      const updatedUser = { ...user, ...data.data.user };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (data.token) localStorage.setItem("token", data.token);

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        if (user.role === "donor") navigate("/donor/dashboard");
        else if (user.role === "ngo") navigate("/ngo/dashboard");
        else if (user.role === "admin") navigate("/admin/dashboard");
      }, 1200);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error && !user)
    return <p className="text-red-600 text-center mt-20">{error}</p>;

  return (
    <section className="py-20 bg-green-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Edit Profile
        </h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-700 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Non-editable fields */}
          <div>
            <label className="block text-gray-700 font-semibold">Name</label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Role-based editable fields */}
          {user.role === "donor" && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode || ""}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Preferences</label>
                <textarea
                  name="preferences"
                  value={formData.preferences || ""}
                  onChange={handleChange}
                  rows="4"
                  maxLength={500}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                />
              </div>
            </>
          )}

          {user.role === "ngo" && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Contact *</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact || ""}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Status</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                  disabled
                />
              </div>
            </>
          )}

          {user.role === "admin" && (
            <div>
              <label className="block text-gray-700 font-semibold">Admin Role *</label>
              <input
                type="text"
                name="adminRole"
                value={formData.adminRole || ""}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-green-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-800 transition mt-4"
          >
            {submitting ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditProfile;