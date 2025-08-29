import React from "react";

const HomePageHero = () => {
  return (
    <section className="relative text-white pt-32">
      {/* Background Image with transparency */}
      <div className="absolute inset-0">
        <img
          src="/home_page_bg.jpeg"  // ✅ from public folder
          alt="Hero Background"
          className="w-full h-full object-cover opacity-100"
        />
        {/* ❌ Removed green overlay */}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Empower Communities, One Donation at a Time
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl">
          Connect with verified NGOs and contribute to meaningful causes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/ngos"
            className="border border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-green-900 transition"
          >
            Explore NGOs
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomePageHero;
