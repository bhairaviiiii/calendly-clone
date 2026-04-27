"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const BASE_URL = "http://127.0.0.1:8000";

export default function ConfirmationPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeeting() {
      try {
        const res = await fetch(`${BASE_URL}/meetings/${id}`);
        if (!res.ok) throw new Error("Failed to fetch meeting");

        const data = await res.json();
        setMeeting(data);
      } catch (error) {
        console.error("Error fetching meeting:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchMeeting();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <p className="text-gray-600 font-medium text-lg">
          Loading confirmation...
        </p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg border text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-3">
            Meeting not found
          </h1>
          <p className="text-gray-600">
            We could not load your booking details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-8 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold">Meeting Confirmed</h1>
          <p className="mt-2 text-green-100">
            Your meeting has been successfully scheduled.
          </p>
        </div>

        {/* Body */}
        <div className="p-8">

          {/* Summary card */}
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 mb-8">
            <p className="text-sm text-blue-600 font-semibold">Event</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {meeting.event_name}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border p-4">
              <p className="text-sm text-gray-500">Invitee</p>
              <p className="font-semibold text-gray-900">
                {meeting.invitee_name}
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-900">
                {meeting.invitee_email}
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="font-semibold text-gray-900">
                {new Date(meeting.start_datetime).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <p className="text-sm text-gray-500">End Time</p>
              <p className="font-semibold text-gray-900">
                {new Date(meeting.end_datetime).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border p-4 col-span-full">
              <p className="text-sm text-gray-500">Status</p>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                {meeting.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/admin/meetings"
              className="flex-1 text-center rounded-2xl bg-blue-600 text-white px-5 py-3 font-semibold hover:bg-blue-700 transition shadow-md"
            >
              View Meetings
            </Link>

            <Link
              href="/"
              className="flex-1 text-center rounded-2xl border border-gray-300 text-gray-700 px-5 py-3 font-semibold hover:bg-gray-50 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}