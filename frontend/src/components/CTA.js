import React from "react";

const CTA = () => {
  return (
    <section className="py-20 bg-green-900 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Make a Difference Today
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of donors and NGOs in creating meaningful impact. Your
          contribution can change lives.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* ✅ Changed href to /donateitems */}
          <a
            href="/donateitems"
            className="bg-yellow-500 text-green-900 font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-400 transition"
          >
            Donate Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;