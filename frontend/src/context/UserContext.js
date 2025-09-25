// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data from backend on app start
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (!storedUser || !token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/auth/${storedUser.role}/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch donations whenever user changes
  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE_URL}/donations/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch donations");
        const data = await res.json();
        setDonations(data.reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonations();
  }, [user]);

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Update localStorage for donations
  useEffect(() => {
    if (!user) return;
    const allDonations = JSON.parse(localStorage.getItem("donations")) || {};
    allDonations[user.email] = donations;
    localStorage.setItem("donations", JSON.stringify(allDonations));
  }, [donations, user]);

  const addDonation = async (donation) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...donation, userId: user.id }),
      });
      if (!res.ok) throw new Error("Failed to save donation to backend");
      const savedDonation = await res.json();
      setDonations((prev) => [savedDonation, ...prev]);
    } catch (err) {
      console.error(err);
      setDonations((prev) => [donation, ...prev]); // fallback for offline
    }
  };

  // Function to refresh user manually after edits
  const refreshUser = async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/${user.role}/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to refresh user");
      const data = await res.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        donations,
        setDonations,
        loading,
        addDonation,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);