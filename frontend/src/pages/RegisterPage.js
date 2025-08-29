// src/pages/RegisterPage.js
import React, { useState } from "react";
import RegisterDonor from "./RegisterDonor";
import RegisterNGO from "./RegisterNGO";
import RegisterAdmin from "./RegisterAdmin";

const RegisterPage = () => {
  const [userType, setUserType] = useState("donor"); // Default selection

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center px-4 pt-10">
      <h1 className="text-4xl font-bold text-green-900 mb-6 text-center">
        Register on SevaConnect
      </h1>

      {/* User Type Selection */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setUserType("donor")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            userType === "donor"
              ? "bg-green-900 text-white"
              : "bg-white text-green-900 border border-green-900 hover:bg-green-800 hover:text-white"
          }`}
        >
          Donor
        </button>
        <button
          onClick={() => setUserType("ngo")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            userType === "ngo"
              ? "bg-green-900 text-white"
              : "bg-white text-green-900 border border-green-900 hover:bg-green-800 hover:text-white"
          }`}
        >
          NGO
        </button>
        <button
          onClick={() => setUserType("admin")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            userType === "admin"
              ? "bg-green-900 text-white"
              : "bg-white text-green-900 border border-green-900 hover:bg-green-800 hover:text-white"
          }`}
        >
          Admin
        </button>
      </div>

      {/* Render Corresponding Form */}
      {userType === "donor" && <RegisterDonor />}
      {userType === "ngo" && <RegisterNGO />}
      {userType === "admin" && <RegisterAdmin />}
    </div>
  );
};

export default RegisterPage;
