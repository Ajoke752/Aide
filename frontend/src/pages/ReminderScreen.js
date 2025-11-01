import React from "react";
import { useParams, Link } from "react-router-dom";

export default function ReminderScreen() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-2">Reminder</h1>
      <p className="text-gray-600">Reminder details for ID: {id}</p>
      <Link
        to="/dashboard"
        className="mt-6 px-4 py-2 bg-brand-blue text-white rounded"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
