// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState("donor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role: entity, // send which entity is logging in
      });

      // store token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", entity);

      // Redirect based on entity
      if (entity === "admin") {
        navigate("/admin/dashboard");
      } else if (entity === "ngo") {
        navigate("/ngo/dashboard");
      } else {
        navigate("/donor/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
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
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Login Form */}
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-900 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition"
          >
            Login as {entity.charAt(0).toUpperCase() + entity.slice(1)}
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
