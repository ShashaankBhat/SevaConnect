// src/pages/RegisterPage.js
import { API_BASE_URL } from "../config/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState("donor"); // donor or ngo
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register/${entity}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      alert(`${entity.charAt(0).toUpperCase() + entity.slice(1)} registered successfully!`);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.message);
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

      {/* User Type Selection */}
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

      {/* Registration Form */}
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder={entity === "donor" ? "Full Name" : "NGO Name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            required
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