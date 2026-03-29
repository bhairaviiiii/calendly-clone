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
        if (!res.ok) {
          throw new Error("Failed to fetch meeting");
        }
        const data = await res.json();
        setMeeting(data);
      } catch (error) {
        console.error("Error fetching meeting:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMeeting();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-md p-8 text-center">
          <p className="text-lg font-medium text-gray-700">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-3">Meeting not found</h1>
          <p className="text-gray-600">We could not load the booking details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-green-50 border-b border-green-200 px-8 py-6">
          <p className="text-sm font-semibold text-green-700 mb-2">Booking Confirmed</p>
          <h1 className="text-3xl font-bold text-gray-900">Meeting Scheduled 🎉</h1>
          <p className="text-gray-600 mt-2">
            Your meeting has been successfully booked.
          </p>
        </div>

        <div className="p-8">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Meeting ID</p>
              <p className="font-semibold text-gray-900">{meeting.id}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500 mb-1">Event</p>
            <p className="font-semibold text-gray-900">{meeting.event_name}</p>
          </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Invitee Name</p>
              <p className="font-semibold text-gray-900">{meeting.invitee_name}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Invitee Email</p>
              <p className="font-semibold text-gray-900">{meeting.invitee_email}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Start Time</p>
              <p className="font-semibold text-gray-900">
                {new Date(meeting.start_datetime).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">End Time</p>
              <p className="font-semibold text-gray-900">
                {new Date(meeting.end_datetime).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  meeting.status === "scheduled"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {meeting.status}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/admin/meetings"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-3 font-semibold hover:bg-blue-700 transition"
            >
              View Meetings
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 text-gray-700 px-5 py-3 font-semibold hover:bg-gray-50 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}