// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { useUser } from "../context/UserContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser(); // set user in context
  const [entity, setEntity] = useState("donor"); // default role
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
      if (!res.ok) throw new Error(data.error || "Login failed");

      const user = data.donor || data.ngo || data.admin || data.user || {};

      // Unified user object
      const userData = {
        id: user.donor_id || user.ngo_id || user.admin_id || user.id,
        name: user.donor_name || user.ngo_name || user.admin_name || user.name || "",
        email: user.donor_email || user.ngo_email || user.admin_email || user.email || "",
        role: entity,
        contact: user.donor_contact || user.ngo_contact || user.contact || "",
        address: user.donor_address || user.address || "",
        city: user.donor_city || user.ngo_city || user.city || "",
        state: user.donor_state || user.ngo_state || user.state || "",
        pincode: user.donor_pincode || user.pincode || "",
        preferences: user.donor_preferences || user.preferences || "",
        ...(user.adminRole && { adminRole: user.adminRole }),
        ...(user.status && { status: user.status }),
      };

      // Save user in context and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Save token
      if (data.token) localStorage.setItem("token", data.token);

      // Initialize user's donation storage if not present
      const allDonations = JSON.parse(localStorage.getItem("donations")) || {};
      if (!allDonations[userData.email]) allDonations[userData.email] = [];
      localStorage.setItem("donations", JSON.stringify(allDonations));

      // Redirect to dashboard based on role
      if (entity === "donor") navigate("/donor/dashboard");
      else if (entity === "ngo") navigate("/ngo/dashboard");
      else if (entity === "admin") navigate("/admin/dashboard");
      else navigate("/");

    } catch (err) {
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

        {/* Role selection */}
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

        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

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
            {loading ? "Logging in..." : `Login as ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}
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
