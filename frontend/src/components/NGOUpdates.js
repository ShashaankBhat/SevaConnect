// src/components/NGOUpdates.js
import React from "react";
import { FaNewspaper, FaCalendarAlt } from "react-icons/fa";

const ngoUpdates = [
  {
    id: 1,
    title: "CRY Launches Child Rights Awareness Drive",
    ngo: "CRY - Child Rights and You",
    date: "August 2025",
    description:
      "CRY has initiated a nationwide campaign to spread awareness about child rights and education access.",
    link: "https://www.cry.org/",
  },
  {
    id: 2,
    title: "Smile Foundation Expands Healthcare Initiatives",
    ngo: "Smile Foundation",
    date: "July 2025",
    description:
      "Smile Foundation is expanding its healthcare programs to provide mobile hospital vans in rural areas.",
    link: "https://www.smilefoundationindia.org/",
  },
  {
    id: 3,
    title: "HelpAge India Senior Care Campaign",
    ngo: "HelpAge India",
    date: "June 2025",
    description:
      "HelpAge India has launched a campaign to provide free health check-ups and support for senior citizens.",
    link: "https://www.helpageindia.org/",
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
            <a
              key={update.id}
              href={update.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-2 block"
            >
              <h3 className="text-xl font-semibold text-green-900 mb-2 flex items-center gap-2">
                <FaNewspaper /> {update.title}
              </h3>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <FaCalendarAlt /> {update.date}
              </p>
              <p className="text-gray-700 mb-4">{update.description}</p>
              <p className="text-gray-600 mb-4 font-medium">By {update.ngo}</p>
              <span className="inline-block bg-green-600 text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-green-700 transition">
                Visit Website
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NGOUpdates;