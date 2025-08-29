// src/components/RequirementsShowcase.js
import React from "react";
import { FaHandsHelping, FaBoxOpen, FaHeartbeat } from "react-icons/fa";

const requirements = [
  {
    id: 1,
    title: "1 Million Meals Campaign",
    ngo: "Feeding India by Zomato",
    description:
      "Feeding India runs a campaign to serve 1 million meals to undernourished families across India.",
    icon: <FaBoxOpen className="text-green-700 text-4xl" />,
    link: "https://www.feedingindia.org/donate"
  },
  {
    id: 2,
    title: "10,000 Blankets for Winter",
    ngo: "Uday Foundation",
    description:
      "Uday Foundation aims to distribute 10,000 blankets to homeless people during peak winter.",
    icon: <FaHandsHelping className="text-green-700 text-4xl" />,
    link: "https://www.udayfoundation.org/donate-blankets/"
  },
  {
    id: 3,
    title: "5,000 School Kits",
    ngo: "CRY (Child Rights and You)",
    description:
      "CRY runs a campaign to provide 5,000 school kits (bags, books, stationery) to underprivileged children.",
    icon: <FaHeartbeat className="text-green-700 text-4xl" />,
    link: "https://www.cry.org/donate/"
  },
];

const RequirementsShowcase = () => {
  return (
    <section className="py-20 bg-green-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-12">
          Current NGO Requirements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {requirements.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <div className="mb-4 flex justify-center">{req.icon}</div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                {req.title}
              </h3>
              <p className="text-gray-600 mb-4 font-medium">By {req.ngo}</p>
              <p className="text-gray-700 mb-6">{req.description}</p>
              <a
                href={req.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
              >
                Contribute
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RequirementsShowcase;
