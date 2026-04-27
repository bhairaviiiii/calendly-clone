"use client";

import { useEffect, useMemo, useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  async function fetchMeetings() {
    try {
      const res = await fetch(`${BASE_URL}/meetings/`);
      const data = await res.json();
      setMeetings(data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: number) {
    try {
      await fetch(`${BASE_URL}/meetings/${id}/cancel`, {
        method: "PUT",
      });
      fetchMeetings();
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  }

  const now = new Date();

  const upcomingMeetings = useMemo(() => {
    return meetings
      .filter((meeting) => new Date(meeting.start_datetime) >= now)
      .sort(
        (a, b) =>
          new Date(a.start_datetime).getTime() -
          new Date(b.start_datetime).getTime()
      );
  }, [meetings]);

  const pastMeetings = useMemo(() => {
    return meetings
      .filter((meeting) => new Date(meeting.start_datetime) < now)
      .sort(
        (a, b) =>
          new Date(b.start_datetime).getTime() -
          new Date(a.start_datetime).getTime()
      );
  }, [meetings]);

  const cancelledMeetings = meetings.filter(
    (meeting) => meeting.status === "cancelled"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <p className="text-gray-600 font-medium text-lg">
          Loading meetings...
        </p>
      </div>
    );
  }

  function MeetingCard({
    meeting,
    showCancelButton = false,
  }: {
    meeting: any;
    showCancelButton?: boolean;
  }) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {meeting.invitee_name}
            </p>

            <p className="text-gray-500 mt-1">{meeting.invitee_email}</p>

            {meeting.event_name && (
              <p className="text-sm text-blue-600 font-semibold mt-3">
                {meeting.event_name}
              </p>
            )}

            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Start:</span>{" "}
                {new Date(meeting.start_datetime).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">End:</span>{" "}
                {new Date(meeting.end_datetime).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                meeting.status === "scheduled"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {meeting.status}
            </span>

            {showCancelButton && meeting.status === "scheduled" && (
              <button
                onClick={() => handleCancel(meeting.id)}
                className="rounded-xl bg-red-500 text-white px-4 py-2 text-sm font-semibold hover:bg-red-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  function EmptyState({ text }: { text: string }) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-8 text-center">
        <p className="text-gray-500 font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Admin Dashboard
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mt-1">
            Meetings
          </h1>
          <p className="text-gray-500 mt-2">
            View, track, and manage all scheduled meetings.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Meetings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {meetings.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Upcoming</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {upcomingMeetings.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-3xl font-bold text-red-500 mt-2">
              {cancelledMeetings.length}
            </p>
          </div>
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Meetings
            </h2>
            <span className="text-sm text-gray-500">
              {upcomingMeetings.length} meetings
            </span>
          </div>

          {upcomingMeetings.length === 0 ? (
            <EmptyState text="No upcoming meetings yet." />
          ) : (
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  showCancelButton={true}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Past Meetings
            </h2>
            <span className="text-sm text-gray-500">
              {pastMeetings.length} meetings
            </span>
          </div>

          {pastMeetings.length === 0 ? (
            <EmptyState text="No past meetings found." />
          ) : (
            <div className="space-y-4">
              {pastMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}