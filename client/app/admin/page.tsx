"use client"; //this will run on client side

import { useEffect, useState } from "react";
import { getEventTypes } from "@/lib/api";
// useState → store data
// useEffect → run code after page loads
// getEventTypes → your API function (calls FastAPI)

export default function AdminPage() {
  const [eventTypes, setEventTypes] = useState([]);
//   eventTypes → stores data (initially empty array)
// setEventTypes → function to update it

  useEffect(() => { //runs when page loads
    async function fetchData() {
      const data = await getEventTypes();
      setEventTypes(data);
    } //call API-- get data-- store in state

    fetchData();//actually runs the function
  }, []); //dependency array-- runs only once

  return ( //this is what gets displayed on the screen
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Event Types</h1>

      <div className="space-y-4">
        {eventTypes.map((event: any) => (
          <div
            key={event.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <h2 className="text-lg font-semibold">{event.name}</h2>
            <p className="text-gray-500">{event.duration_minutes} minutes</p>
            <a
            href={`/book/${event.slug}`}
            className="text-blue-600 text-sm underline">/book/{event.slug}</a>
          </div>
        ))}
      </div>
    </div>
  );
}