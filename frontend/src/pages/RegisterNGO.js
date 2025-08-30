// src/pages/RegisterNGO.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterNGO = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    regNo: "",
    address: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register/ngo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          regNo: form.regNo,
          address: form.address,
          contact: form.contact,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      console.log("✅ NGO registered successfully:", data);
      if (data.token) localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (err) {
      console.error("❌ Error registering NGO:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          NGO Registration
        </h2>

        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* NGO Name */}
          <div>
            <label className="block text-green-900 font-medium mb-1">NGO Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter NGO Name"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-green-900 font-medium mb-1">Registration Number</label>
            <input
              type="text"
              name="regNo"
              value={form.regNo}
              onChange={handleChange}
              placeholder="Enter Registration Number"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />

          {/* Address */}
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />

          {/* Contact */}
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-900 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register as NGO"}
          </button>
        </form>
      </div>yes
    </div>
  );
};

export default RegisterNGO;