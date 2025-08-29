// src/pages/RegisterAdmin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterAdmin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "superadmin", // default role for admin
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to backend
      const res = await axios.post("http://localhost:5000/api/auth/register", form);

      if (res.status === 201 || res.status === 200) {
        alert("Admin registered successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error registering admin:", err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Admin Registration
        </h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
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
          <button
            type="submit"
            className="w-full bg-green-900 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition"
          >
            Register as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterAdmin;
