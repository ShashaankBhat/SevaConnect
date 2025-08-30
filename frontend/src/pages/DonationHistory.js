// src/pages/DonationHistory.js
import React, { useEffect, useState } from "react";

export default function DonationHistory() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const allDonations = JSON.parse(localStorage.getItem("donations") || "{}");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userEmail = user.email || "unknown";

    // Only show donations for this user
    const userDonations = allDonations[userEmail] || [];
    setDonations(userDonations.reverse()); // newest first
  }, []);

  return (
    <div className="min-h-[70vh] flex items-start justify-center bg-green-50 px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Donation History
        </h2>
        {donations.length === 0 ? (
          <p className="text-gray-600 text-center">
            No donations yet. Start donating to see your history here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100 text-green-900">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">NGO</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Details</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b hover:bg-green-50">
                    <td className="p-3">
                      {new Date(d.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{d.ngo}</td>
                    <td className="p-3 capitalize">{d.type}</td>
                    <td className="p-3">
                      {d.type === "money" ? (
                        <>₹{d.amount}</>
                      ) : (
                        <>
                          {d.quantity} × {d.item_name} <br />
                          <span className="text-sm text-gray-600">
                            {d.pickup_or_drop === "pickup"
                              ? "Pickup requested"
                              : "Drop-off"}
                          </span>
                          {d.notes && (
                            <p className="text-sm text-gray-500 italic mt-1">
                              {d.notes}
                            </p>
                          )}
                        </>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          d.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}