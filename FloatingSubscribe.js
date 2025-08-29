// src/components/FloatingSubscribe.js
import React, { useState } from "react";
import NewsletterSignup from "./NewsletterSignup";

const FloatingSubscribe = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-yellow-500 text-green-900 px-6 py-4 rounded-full shadow-lg hover:bg-yellow-400 transition z-50"
      >
        Subscribe
      </button>

      <NewsletterSignup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FloatingSubscribe;
