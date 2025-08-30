import React, { useEffect, useState } from "react";
import { FaGlobe } from "react-icons/fa";

// Predefined list of NGOs (combine all your website NGOs + some real ones)
const ALL_NGOS = [
  { id: 1, name: "Snehalaya", city: "Pune", cause: "Women & Children", website: "https://www.snehalaya.org" },
  { id: 2, name: "Gramin Samassya Mukti Trust", city: "Aurangabad", cause: "Rural Development", website: "http://www.gsmtrust.org" },
  { id: 3, name: "AIM for Seva", city: "Bangalore", cause: "Education", website: "https://www.aimforseva.org" },
  { id: 4, name: "Akshaya Patra Foundation", city: "Bangalore", cause: "Mid-day Meals", website: "https://www.akshayapatra.org" },
  { id: 5, name: "Goonj", city: "Delhi", cause: "Clothing & Essentials", website: "https://goonj.org" },
  { id: 6, name: "Pratham Education Foundation", city: "Mumbai", cause: "Education", website: "https://www.pratham.org" },
  { id: 7, name: "CRY (Child Rights & You)", city: "Delhi", cause: "Child Welfare", website: "https://www.cry.org" },
  { id: 8, name: "HelpAge India", city: "Chennai", cause: "Senior Citizens", website: "https://www.helpageindia.org" },
  { id: 9, name: "Save the Children India", city: "Delhi", cause: "Child Welfare", website: "https://www.savethechildren.in" },
  { id: 10, name: "Pravah", city: "Mumbai", cause: "Youth Development", website: "https://www.pravah.org" },
];

export default function SuggestedNGOs() {
  const [donations, setDonations] = useState([]);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("donations") || "[]");
    setDonations(stored);
    const donatedNGOs = stored.map((d) => d.ngo);
    const suggestedNGOs = ALL_NGOS.filter((ngo) => !donatedNGOs.includes(ngo.name));
    setSuggested(suggestedNGOs);
  }, []);

  return (
    <section className="min-h-[70vh] bg-green-50 px-4 py-10 pt-[120px]">
      {/* Added pt-[120px] to move content below navbar */}
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-green-900 mb-8 text-center">
          Suggested NGOs for You
        </h2>
        {suggested.length === 0 ? (
          <p className="text-gray-600 text-center">
            You've already donated to all our listed NGOs! Thank you for your support.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {suggested.map((ngo) => (
              <a
                key={ngo.id}
                href={ngo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-2"
              >
                <h3 className="text-xl font-semibold text-green-900 mb-2">{ngo.name}</h3>
                <p className="text-gray-600 mb-1">
                  <strong>City:</strong> {ngo.city}
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Cause:</strong> {ngo.cause}
                </p>
                <div className="flex items-center gap-2 text-green-600 font-medium hover:underline">
                  <FaGlobe /> Visit Website
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}