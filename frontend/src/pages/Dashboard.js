// src/pages/Dashboard.js
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus, FaSun, FaMoon } from "react-icons/fa";
import { MdLunchDining } from "react-icons/md"; // <-- THE FIX IS HERE

export default function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch user and their schedule
  useEffect(() => {
    // We need 'withCredentials' to allow cookies to be sent
    axios
      .get("http://localhost:5000/auth/current_user", { withCredentials: true })
      .then((res) => setUser(res.data));

    axios
      .get("http://localhost:5000/api/medicine/today", {
        withCredentials: true,
      })
      .then((res) => setSchedule(res.data));
  }, []);

  const getIcon = (time) => {
    if (time === "morning") return <FaSun className="text-yellow-500" />;
    if (time === "evening") return <FaMoon className="text-indigo-400" />;
    return <MdLunchDining className="text-orange-500" />; // <-- AND THE FIX IS HERE
  };

  return (
    <div className="min-h-screen bg-brand-light p-4">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
      <h2 className="text-xl mt-6 font-semibold">Your Daily Schedule</h2>

      <div className="mt-4 space-y-4">
        {schedule.map((med) => (
          <div
            key={med._id}
            className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4"
          >
            <img
              src={med.photoUrl}
              alt={med.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold">{med.name}</h3>
              <div className="flex gap-4 mt-2">
                {med.schedule.map((s, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {getIcon(s.time)} {s.dose} pill(s)
                  </span>
                ))}
              </div>
            </div>
            {/* TODO: Add a checkmark button here */}
          </div>
        ))}
      </div>

      {/* Floating Action Button (FAB) */}
      <Link
        to="/add"
        className="fixed bottom-6 right-6 bg-brand-blue text-white p-5 rounded-full shadow-lg"
      >
        <FaPlus size={24} />
      </Link>
    </div>
  );
}
