"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BASE_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [eventTypes, setEventTypes] = useState<any[]>([]);

  useEffect(() => {
    fetchEventTypes();
  }, []);

  async function fetchEventTypes() {
    try {
      const res = await fetch(`${BASE_URL}/event-types/`);
      const data = await res.json();
      setEventTypes(data);
    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center px-6">

      <div className="max-w-6xl text-center">
        
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Schedule meetings
          <br />
          <span className="text-blue-600">without the back-and-forth</span>
        </h1>

        <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
          Choose a meeting type and book instantly based on availability.
        </p>

        {/* Event Types */}
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {eventTypes.map((event) => (
            <Link
              key={event.id}
              href={`/book/${event.slug}`}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition text-left"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {event.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                {event.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-600">
                  {event.duration_minutes} mins
                </span>

                <span className="text-sm text-gray-400">
                  Book →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Dashboard Button */}
        <div className="mt-12">
          <Link
            href="/admin/meetings"
            className="rounded-2xl border border-gray-300 text-gray-700 px-8 py-4 font-semibold hover:bg-gray-50 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-16 text-sm text-gray-500">
        Built with ❤️ using Next.js & FastAPI
      </div>
    </div>
  );
}