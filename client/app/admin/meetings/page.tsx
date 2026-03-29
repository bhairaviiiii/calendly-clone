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
      fetchMeetings(); // refresh list
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  }

  const now = new Date();

  // This keeps only meetings whose start time is still in the future.
  const upcomingMeetings = useMemo(() => {
    return meetings
      .filter((meeting) => new Date(meeting.start_datetime) >= now)
      .sort(
        (a, b) =>
          new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
      );
  }, [meetings]);

  // This keeps only meetings whose start time has already passed.
  const pastMeetings = useMemo(() => {
    return meetings
      .filter((meeting) => new Date(meeting.start_datetime) < now)
      .sort(
        (a, b) =>
          new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime()
      );
  }, [meetings]);

  if (loading) {
    return <div className="p-8">Loading meetings...</div>;
  }


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Meetings</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Meetings</h2>

          {upcomingMeetings.length === 0 ? (
            <p className="text-gray-500">No upcoming meetings.</p>
          ) : (
            <div className="space-y-4">
              {upcomingMeetings.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border rounded-xl p-5 shadow-sm flex justify-between items-start"
                >
                  <div>
                    <p className="font-semibold text-lg">{m.invitee_name}</p>
                    <p className="text-gray-600">{m.invitee_email}</p>
                    <p className="text-sm text-gray-700 mt-2">
                      {new Date(m.start_datetime).toLocaleString()}
                    </p>
                    <p className="text-sm mt-1">
                      Status:{" "}
                      <span className="font-medium capitalize">{m.status}</span>
                    </p>
                  </div>

                  {m.status === "scheduled" && (
                    <button
                      onClick={() => handleCancel(m.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Past Meetings</h2>

          {pastMeetings.length === 0 ? (
            <p className="text-gray-500">No past meetings.</p>
          ) : (
            <div className="space-y-4">
              {pastMeetings.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border rounded-xl p-5 shadow-sm"
                >
                  <p className="font-semibold text-lg">{m.invitee_name}</p>
                  <p className="text-gray-600">{m.invitee_email}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    {new Date(m.start_datetime).toLocaleString()}
                  </p>
                  <p className="text-sm mt-1">
                    Status:{" "}
                    <span className="font-medium capitalize">{m.status}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}