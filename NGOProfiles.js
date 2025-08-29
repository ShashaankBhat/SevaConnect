// src/components/NGOProfiles.js
import React from "react";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";

const ngos = [
  {
    id: 1,
    name: "Snehalaya",
    location: "Ahmednagar, Maharashtra",
    description:
      "Provides support for women, children, and LGBTQ+ communities affected by poverty.",
    members: 200,
    link: "https://www.snehalaya.org/",
  },
  {
    id: 2,
    name: "Gramin Samassya Mukti Trust",
    location: "Aurangabad, Maharashtra",
    description:
      "Focuses on poverty eradication, women empowerment, and skill development programs.",
    members: 100,
    link: "http://gsmtrust.org/",
  },
  {
    id: 3,
    name: "AIM for Seva",
    location: "Aurangabad, Maharashtra",
    description:
      "Provides education and healthcare support to rural and tribal children.",
    members: 180,
    link: "https://www.aimforseva.org/",
  },
];

const NGOProfiles = () => {
  return (
    <section className="py-20 bg-green-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-12">
          Featured NGOs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ngos.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold mb-2 text-green-900">
                  {ngo.name}
                </h3>
                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt /> {ngo.location}
                </p>
                <p className="text-gray-700 mb-4">{ngo.description}</p>
                <p className="text-gray-600 flex items-center gap-2 mb-4">
                  <FaUsers /> {ngo.members} members
                </p>
                <a
                  href={ngo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <button className="bg-yellow-500 text-green-900 font-semibold px-5 py-2 rounded-xl shadow hover:bg-yellow-400 transition w-full">
                    View Profile
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NGOProfiles;
