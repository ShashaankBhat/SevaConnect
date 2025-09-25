// src/pages/DonateItems.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../config/api";

const NGO_OPTIONS = [
  { name: "Snehalaya", city: "Pune" },
  { name: "Gramin Samassya Mukti Trust", city: "Aurangabad" },
  { name: "AIM for Seva", city: "Chennai" },
  { name: "Akshaya Patra Foundation", city: "Bengaluru" },
  { name: "Goonj", city: "Delhi" },
  { name: "Pratham Education Foundation", city: "Mumbai" },
];

export default function DonateItems() {
  const navigate = useNavigate();
  const { user } = useUser(); // reactive user
  const [mode, setMode] = useState("items"); // 'items' or 'money'
  const [form, setForm] = useState({
    ngo: NGO_OPTIONS[0].name,
    item_name: "",
    quantity: 1,
    pickup_or_drop: "pickup",
    notes: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) return setError("User not logged in.");

    // Validation
    if (mode === "items" && !form.item_name) {
      return setError("Please enter an item name.");
    }
    if (mode === "money" && (!form.amount || Number(form.amount) <= 0)) {
      return setError("Please enter a valid amount.");
    }

    setLoading(true);

    const entry =
      mode === "money"
        ? {
            id: Date.now(),
            type: "money",
            ngo: form.ngo,
            amount: Number(form.amount),
            status: "pending",
            date: new Date().toISOString(),
          }
        : {
            id: Date.now(),
            type: "items",
            ngo: form.ngo,
            item_name: form.item_name,
            quantity: Number(form.quantity),
            pickup_or_drop: form.pickup_or_drop,
            notes: form.notes,
            status: "pending",
            date: new Date().toISOString(),
          };

    try {
      // 1️⃣ Save to backend
      const res = await fetch(`${API_BASE_URL}/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...entry, user_id: user.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save donation to backend");
      }

      // 2️⃣ Save to localStorage
      const allDonations = JSON.parse(localStorage.getItem("donations") || "{}");
      if (!allDonations[user.email]) allDonations[user.email] = [];
      allDonations[user.email].push(entry);
      localStorage.setItem("donations", JSON.stringify(allDonations));

      navigate("/donor/donation-history");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-start justify-center bg-green-50 px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-green-900 mb-6">
          {mode === "items" ? "Donate Items" : "Donate Money"}
        </h2>

        <div className="flex gap-3 mb-6">
          {["items", "money"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-full font-semibold ${
                mode === m
                  ? "bg-green-900 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form className="space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="text-sm text-gray-700">Select NGO</span>
            <select
              name="ngo"
              value={form.ngo}
              onChange={update}
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            >
              {NGO_OPTIONS.map((n) => (
                <option key={n.name} value={n.name}>
                  {n.name} ({n.city})
                </option>
              ))}
            </select>
          </label>

          {mode === "items" ? (
            <>
              <input
                type="text"
                name="item_name"
                value={form.item_name}
                onChange={update}
                placeholder="Item name (e.g., blankets, notebooks)"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
              />
              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={update}
                placeholder="Quantity"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
              />
              <label className="block">
                <span className="text-sm text-gray-700">Pickup or Drop</span>
                <select
                  name="pickup_or_drop"
                  value={form.pickup_or_drop}
                  onChange={update}
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                >
                  <option value="pickup">Pickup</option>
                  <option value="drop">Drop</option>
                </select>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={update}
                placeholder="Additional notes (optional)"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                rows={3}
              />
            </>
          ) : (
            <input
              type="number"
              name="amount"
              min="1"
              value={form.amount}
              onChange={update}
              placeholder="Amount (₹)"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-900 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-70"
          >
            {loading
              ? "Submitting..."
              : mode === "items"
              ? "Submit Item Donation"
              : "Donate Money"}
          </button>
        </form>
      </div>
    </div>
  );
}
