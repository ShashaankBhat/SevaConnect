// src/pages/DonorDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { API_BASE_URL } from "../config/api";

export default function DonorDashboard() {
  const navigate = useNavigate();
  const { user } = useUser(); // reactive user
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const suggestedNGOs = [
    {
      name: "Goonj",
      category: "Clothing & Disaster Relief",
      description: "Focuses on clothing, education, and disaster relief across India.",
      link: "https://goonj.org/",
    },
    {
      name: "Akshaya Patra Foundation",
      category: "Mid-day Meals",
      description: "Runs mid-day meal programs for underprivileged children.",
      link: "https://www.akshayapatra.org/",
    },
    {
      name: "CRY - Child Rights and You",
      category: "Child Welfare",
      description: "Works for children’s rights, education, and healthcare.",
      link: "https://www.cry.org/",
    },
    {
      name: "HelpAge India",
      category: "Senior Citizens",
      description: "Supports elderly care and promotes elder rights in India.",
      link: "https://www.helpageindia.org/",
    },
  ];

  // Fetch donations from localStorage first, then merge with backend
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDonations = async () => {
      try {
        // Load from localStorage
        const allDonations = JSON.parse(localStorage.getItem("donations") || "{}");
        let storedDonations = allDonations[user.email] || [];

        // Fetch from backend
        const res = await fetch(`${API_BASE_URL}/donations?user_id=${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.ok) {
          const backendDonations = await res.json();

          // Merge backend + localStorage, remove duplicates by id
          const merged = [
            ...storedDonations,
            ...backendDonations.filter(
              (bd) => !storedDonations.some((sd) => sd.id === bd.id)
            ),
          ].sort((a, b) => new Date(b.date) - new Date(a.date));

          storedDonations = merged;

          // Update localStorage
          allDonations[user.email] = merged;
          localStorage.setItem("donations", JSON.stringify(allDonations));
        }

        setDonations(storedDonations);
      } catch (err) {
        console.error(err);
        setError("Failed to load donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  const totalMoney = donations
    .filter((d) => d.type === "money")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalItems = donations
    .filter((d) => d.type !== "money")
    .reduce((sum, d) => sum + d.quantity, 0);

  if (loading) return <p className="text-center mt-28">Loading donations...</p>;
  if (error) return <p className="text-center mt-28 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-green-50 px-4 py-10 pt-28">
      <div className="max-w-5xl mx-auto space-y-10">
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-green-900 mb-4">
            Welcome Back, {user?.name || "Donor"}!
          </h2>
          <p className="text-gray-700 mb-2">
            You've made <span className="font-semibold">{donations.length}</span> donations.
          </p>
          <p className="text-gray-700 mb-2">
            Total money donated: <span className="font-semibold">₹{totalMoney}</span>
          </p>
          <p className="text-gray-700">
            Total items donated: <span className="font-semibold">{totalItems}</span>
          </p>
        </section>

        {/* Donations List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-green-900">Your Donations</h2>
            <button
              onClick={() => navigate("/donor/donate-items")}
              className="bg-green-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Make a Donation
            </button>
          </div>

          {donations.length === 0 ? (
            <p className="text-center text-gray-600">No donations made yet.</p>
          ) : (
            <div className="grid gap-4">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className={`bg-white p-4 rounded-2xl shadow-md flex justify-between items-center transition transform hover:scale-102 ${
                    donation.status === "pending" ? "border-l-4 border-yellow-500" : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold text-green-900">
                      {donation.type === "money"
                        ? `₹${donation.amount} donated to ${donation.ngo}`
                        : `${donation.item_name} × ${donation.quantity} to ${donation.ngo}`}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Status:{" "}
                      <span
                        className={
                          donation.status === "fulfilled"
                            ? "text-green-600"
                            : donation.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {donation.status}
                      </span>
                    </p>
                    {donation.status === "fulfilled" && (
                      <button
                        onClick={() => navigate("/donor/donate-items")}
                        className="mt-2 text-green-900 font-semibold text-sm hover:underline"
                      >
                        Donate Again
                      </button>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {new Date(donation.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Suggested NGOs */}
        <section>
          <h3 className="text-2xl font-bold text-green-900 mb-4">
            Suggested NGOs You Can Support
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {suggestedNGOs.map((ngo, idx) => (
              <a
                key={idx}
                href={ngo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg hover:scale-105 transition transform cursor-pointer"
              >
                <h4 className="text-xl font-semibold text-green-800">{ngo.name}</h4>
                <p className="text-gray-500 text-sm font-medium mb-2">{ngo.category}</p>
                <p className="text-gray-600 text-sm mt-2">{ngo.description}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
