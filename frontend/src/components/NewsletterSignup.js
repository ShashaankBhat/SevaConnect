import { API_BASE_URL } from "../config/api"; // add this import
import React, { useState } from "react";

const NewsletterSignup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Subscription failed");

      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold"
          onClick={onClose}
        >
          ×
        </button>

        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-green-900 text-center">
              Subscribe to our Newsletter
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              Get updates about new campaigns, donation drives, and ways to help.
            </p>

            {error && <p className="text-red-600 text-center mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-green-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-70"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-900 mb-4">
              Thank you for subscribing!
            </h3>
            <button
              className="bg-green-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;