// src/components/NGOUpdates.js
import React from "react";
import { FaNewspaper, FaCalendarAlt } from "react-icons/fa";

const ngoUpdates = [
  {
    id: 1,
    title: "Akshaya Patra Expands Mid-Day Meal Program",
    ngo: "Akshaya Patra Foundation",
    date: "August 2025",
    description:
      "Akshaya Patra is expanding its mid-day meal program to reach more government schools across India.",
    link: "https://www.akshayapatra.org/news"
  },
  {
    id: 2,
    title: "Goonj Winter Campaign Launched",
    ngo: "Goonj",
    date: "July 2025",
    description:
      "Goonj has launched its annual winter campaign to provide clothing and essentials for the needy.",
    link: "https://goonj.org/latest-updates/"
  },
  {
    id: 3,
    title: "Pratham Literacy Drive in Rural Areas",
    ngo: "Pratham Education Foundation",
    date: "June 2025",
    description:
      "Pratham has initiated a literacy drive in rural villages to help bridge the education gap.",
    link: "https://www.pratham.org/news/"
  },
];

const NGOUpdates = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-12">
          Latest NGO Updates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ngoUpdates.map((update) => (
            <div
              key={update.id}
              className="bg-green-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <h3 className="text-xl font-semibold text-green-900 mb-2 flex items-center gap-2">
                <FaNewspaper /> {update.title}
              </h3>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <FaCalendarAlt /> {update.date}
              </p>
              <p className="text-gray-700 mb-4">{update.description}</p>
              <p className="text-gray-600 mb-4 font-medium">By {update.ngo}</p>
              <a
                href={update.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-green-700 transition"
              >
                Read More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NGOUpdates;
