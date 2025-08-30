// src/pages/LoginPage.js
import { API_BASE_URL } from "../config/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState("donor"); // default user type
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: entity }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save user info + JWT token in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ name: data.name || data.user?.name, email, entity })
      );
      if (data.token) localStorage.setItem("token", data.token);

      navigate("/"); // redirect to homepage
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Login
        </h2>

        {/* Entity Selection */}
        <div className="flex justify-center gap-4 mb-6">
          {["donor", "ngo", "admin"].map((type) => (
            <button
              key={type}
              onClick={() => setEntity(type)}
              className={`px-4 py-2 rounded-full font-semibold ${
                entity === type
                  ? "bg-green-900 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-900 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-70"
          >
            {loading
              ? "Logging in..."
              : `Login as ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-yellow-500 font-semibold hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;