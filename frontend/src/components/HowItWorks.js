// src/components/HowItWorks.js
import React from "react";
import { FaRegHandshake, FaBoxOpen, FaHandsHelping } from "react-icons/fa";

const steps = [
  {
    id: 1,
    icon: <FaRegHandshake className="text-green-900 w-12 h-12 mb-4" />,
    title: "Connect with NGOs",
    description:
      "Browse verified NGOs on the platform and understand their needs before contributing.",
  },
  {
    id: 2,
    icon: <FaBoxOpen className="text-green-900 w-12 h-12 mb-4" />,
    title: "Donate Items or Funds",
    description:
      "Easily donate items or funds directly through our secure platform.",
  },
  {
    id: 3,
    icon: <FaHandsHelping className="text-green-900 w-12 h-12 mb-4" />,
    title: "Impact Communities",
    description:
      "See the real impact of your donations in communities and lives transformed.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:scale-105"
            >
              <div className="flex justify-center">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 mt-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
