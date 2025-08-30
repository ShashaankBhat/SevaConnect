// src/pages/MakeDonation.js
import React, { useEffect, useState } from "react";

const MakeDonation = () => {
  const [ngos, setNgos] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [form, setForm] = useState({
    ngoId: "",
    requirementId: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch NGOs on mount
  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ngos");
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch NGOs");
        setNgos(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  // Fetch requirements when NGO is selected
  useEffect(() => {
    const fetchRequirements = async () => {
      if (!form.ngoId) return setRequirements([]);
      try {
        const res = await fetch(
          `http://localhost:5000/api/requirements/ngo/${form.ngoId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch requirements");
        setRequirements(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchRequirements();
  }, [form.ngoId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ngoId: form.ngoId,
          requirementId: form.requirementId,
          quantity: form.quantity,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Donation failed");
      setSuccess("Donation submitted successfully!");
      setForm({ ngoId: "", requirementId: "", quantity: "" });
      setRequirements([]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading NGOs...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Make a Donation
        </h2>
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3 text-center">{success}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <select
            name="ngoId"
            value={form.ngoId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          >
            <option value="">Select NGO</option>
            {ngos.map((ngo) => (
              <option key={ngo.ngo_id} value={ngo.ngo_id}>
                {ngo.ngo_name}
              </option>
            ))}
          </select>

          <select
            name="requirementId"
            value={form.requirementId}
            onChange={handleChange}
            required
            disabled={!requirements.length}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          >
            <option value="">Select Requirement</option>
            {requirements.map((req) => (
              <option key={req.requirement_id} value={req.requirement_id}>
                {req.item_name} - {req.quantity} needed
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity to Donate"
            min="1"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-900 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Donate"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeDonation;