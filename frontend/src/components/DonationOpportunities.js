// src/components/DonationOpportunities.js
import React from "react";
import { FaHandsHelping, FaMapMarkerAlt, FaClock } from "react-icons/fa";

// Verified NGOs with working donation links
const donationOpportunities = [
  {
    id: 1,
    title: "Mid-Day Meal Program",
    ngo: "Akshaya Patra Foundation",
    location: "Pune",
    date: "Sept 10, 2025",
    description:
      "Support Akshaya Patra’s Mid-Day Meal Program to provide nutritious meals to school children.",
    link: "https://www.akshayapatra.org/donate-to-midday-meal-programme"
  },
  {
    id: 2,
    title: "Winter Clothing Drive",
    ngo: "Goonj",
    location: "Mumbai",
    date: "Oct 5, 2025",
    description:
      "Help provide warm clothing and blankets to the homeless through Goonj.",
    link: "https://goonj.org/donate/"
  },
  {
    id: 3,
    title: "Education for All",
    ngo: "Pratham Education Foundation",
    location: "Aurangabad",
    date: "Nov 12, 2025",
    description:
      "Donate to Pratham to support education and literacy across India.",
    link: "https://www.pratham.org/donation/"
  },
];

const DonationOpportunities = () => {
  return (
    <section className="py-20 bg-green-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-12">
          Donation Opportunities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {donationOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-green-900">{opp.title}</h3>
                <span className="text-gray-600 text-sm flex items-center gap-1">
                  <FaClock /> {opp.date}
                </span>
              </div>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt /> {opp.location}
              </p>
              <p className="text-gray-700 mb-4">{opp.description}</p>
              <p className="text-gray-600 mb-4 flex items-center gap-2">
                <FaHandsHelping /> Organized by {opp.ngo}
              </p>
              <a
                href={opp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-yellow-500 text-green-900 font-semibold px-5 py-2 rounded-xl shadow hover:bg-yellow-400 transition"
              >
                Join Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonationOpportunities;
