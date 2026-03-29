"use client";

import { useState } from "react";
import { createAvailability } from "@/lib/api";
// createAvailability → API call to backend

export default function AvailabilityPage() {
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [message, setMessage] = useState("");

  async function handleSave() { //Runs when user clicks Save Availability
    const payload = { //Converts frontend data → backend format
      day_of_week: dayOfWeek,
      start_time: startTime + ":00", //backend expects full time format
      end_time: endTime + ":00", //"09:00" → "09:00:00"
      timezone: timezone,
      is_active: true,
    };

    try {
      await createAvailability(payload); //Sends data to backend
      setMessage("Availability saved successfully!");
    } catch (error) {
      console.error("Error saving availability:", error);
      setMessage("Failed to save availability");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Availability Settings</h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Day of Week</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Timezone</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save Availability
          </button>

          {message && <p className="text-sm text-green-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}