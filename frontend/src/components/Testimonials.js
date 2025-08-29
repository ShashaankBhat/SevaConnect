// src/components/Testimonials.js
import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Nitika Raina",
    role: "Donor",
    message:
      "SevaConnect made it incredibly easy to donate and track my contributions. Truly impactful!",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "NGO Volunteer",
    message:
      "Thanks to SevaConnect, our campaigns reached more donors and we could help more families.",
  },
  {
    id: 3,
    name: "Ramesh Kumar",
    role: "Donor",
    message:
      "I love the transparency and ease of donating through SevaConnect. Highly recommended!",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-green-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-12">
          What People Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi) => (
            <div
              key={testi.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <FaQuoteLeft className="text-green-900 text-3xl mb-4" />
              <p className="text-gray-700 mb-6 italic">"{testi.message}"</p>
              <h3 className="text-lg font-semibold text-green-900">{testi.name}</h3>
              <p className="text-gray-600 text-sm">{testi.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
