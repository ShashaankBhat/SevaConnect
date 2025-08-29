// src/components/Statistics.js
import React from "react";
import { FaUsers, FaHandsHelping, FaLeaf, FaDonate } from "react-icons/fa";

const stats = [
  {
    id: 1,
    icon: <FaUsers className="text-green-900 text-3xl" />,
    value: "5000+",
    label: "Donors",
  },
  {
    id: 2,
    icon: <FaHandsHelping className="text-green-900 text-3xl" />,
    value: "120+",
    label: "NGOs Supported",
  },
  {
    id: 3,
    icon: <FaLeaf className="text-green-900 text-3xl" />,
    value: "25000+",
    label: "Items Donated",
  },
  {
    id: 4,
    icon: <FaDonate className="text-green-900 text-3xl" />,
    value: "₹12L+",
    label: "Funds Raised",
  },
];

const Statistics = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-12">
          Our Impact
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-green-50 rounded-2xl p-6 flex flex-col items-center justify-center shadow hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <div className="mb-4">{stat.icon}</div>
              <h3 className="text-2xl font-bold text-green-900">{stat.value}</h3>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
