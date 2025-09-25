import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState("donor"); // donor or ngo
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    regNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contact: "",
    preferences: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.contact) {
      setError("Please fill all required fields.");
      return;
    }
    if (entity === "ngo" && !form.regNo) {
      setError("NGO Registration Number is required.");
      return;
    }
    if (form.pincode && !/^\d{5,6}$/.test(form.pincode)) {
      setError("Pincode must be 5 or 6 digits.");
      return;
    }
    if (form.preferences.length > 500) {
      setError("Preferences cannot exceed 500 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: entity,
          name: form.name,
          email: form.email,
          password: form.password,
          regNo: entity === "ngo" ? form.regNo : undefined,
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

      alert(`${entity.charAt(0).toUpperCase() + entity.slice(1)} registered successfully!`);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center px-4 pt-10">
      <h1 className="text-4xl font-bold text-green-900 mb-6 text-center">
        Register on SevaConnect
      </h1>

      {/* Role Selection */}
      <div className="flex gap-4 mb-8">
        {["donor", "ngo"].map((type) => (
          <button
            key={type}
            onClick={() => setEntity(type)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              entity === type
                ? "bg-green-900 text-white"
                : "bg-white text-green-900 border border-green-900 hover:bg-green-800 hover:text-white"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={entity === "donor" ? "Full Name" : "NGO Name"}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />

          {entity === "ngo" && (
            <input
              type="text"
              name="regNo"
              value={form.regNo}
              onChange={handleChange}
              placeholder="Registration Number"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            />
          )}

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
            {loading
              ? "Registering..."
              : `Register as ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-yellow-500 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
