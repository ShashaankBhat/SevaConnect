import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const RegisterDonor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    preferences: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name || !form.email || !form.password || !form.contact) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.pincode && !/^\d{5,6}$/.test(form.pincode)) {
      setError("Pincode must be 5 or 6 digits.");
      return;
    }

    if (form.preferences?.length > 500) {
      setError("Preferences cannot exceed 500 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "donor",
          name: form.name,
          email: form.email,
          password: form.password,
          contact: form.contact,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          preferences: form.preferences,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      alert("Donor registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err?.message || err);
      setError(err?.message || "Something went wrong during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Donor Registration
        </h2>
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            />
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            />
          </div>
          <input
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          <textarea
            name="preferences"
            value={form.preferences}
            onChange={handleChange}
            placeholder="Preferences (optional)"
            rows="3"
            maxLength={500}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-900 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register as Donor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterDonor;