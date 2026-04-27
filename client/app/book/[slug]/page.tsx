"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getEventTypeBySlug, createMeeting, getAvailableSlots } from "@/lib/api";

export default function BookingPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const router = useRouter();

  const [eventType, setEventType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  //   eventType → stores event data
// loading → tracks if data is still loading

  const [inviteeName, setInviteeName] = useState("");
  const [inviteeEmail, setInviteeEmail] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  // Stores the date chosen by the user.
  const [slots, setSlots] = useState<any[]>([]);
  // Stores all available slots returned by backend for that date.
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  // Stores the slot the user clicked.

  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    async function fetchEventType() {
      try {
        const data = await getEventTypeBySlug(slug);
        setEventType(data);
      } catch (error) {
        console.error("Error fetching event type:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchEventType();
    }
  }, [slug]);

  
  async function handleBooking() {
  if (!eventType || !selectedDate || !selectedSlot) return;

  const start = new Date(`${selectedDate}T${selectedSlot.start}:00`);
  const end = new Date(`${selectedDate}T${selectedSlot.end}:00`);

  const meetingData = {
    event_type_id: eventType.id,
    host_user_id: 1,
    invitee_name: inviteeName,
    invitee_email: inviteeEmail,
    start_datetime: start.toISOString(),
    end_datetime: end.toISOString(),
  };

  try {
  setErrorMessage("");
  const response = await createMeeting(meetingData);

  router.push(`/confirmation/${response.meeting.id}`);
} catch (error: any) {
  setSuccessMessage("");
  setErrorMessage(error.message || "Booking failed");

  const updatedSlots = await getAvailableSlots(eventType.id, selectedDate);
  setSlots(updatedSlots);
  setSelectedSlot(null);
  setShowForm(false);
}
  }
if (loading) {
    return <div className="p-8">Loading...</div>;
  } //show "Loading..."

  if (!eventType) {
    return <div className="p-8 text-red-500">Event type not found</div>;
  } //show error message


  async function handleDateChange(date: string) {
  setSelectedDate(date);
  setSelectedSlot(null);
  setShowForm(false);//If date changes, booking form should hide until a new slot is selected.

  if (!eventType) return;
//Safety check. If event details haven’t loaded yet, don’t fetch slots.

  try {
    const data = await getAvailableSlots(eventType.id, date);
    // Calls backend to get free slots for that event type and date
    setSlots(data); //Stores returned slots so you can display them as buttons.
  } catch (error) {
    console.error("Error fetching slots:", error);
    setSlots([]);
  }
}
  return (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-8">
          <p className="text-sm font-medium text-blue-600 mb-3">Calendly Clone</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{eventType.name}</h1>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Duration:</span> {eventType.duration_minutes} minutes
          </p>
          <p className="text-gray-500 mb-6">
            /book/{eventType.slug}
          </p>

          <div className="mt-8 space-y-4 text-sm text-gray-600">
           <div className="flex items-center gap-2">
            <span className="text-blue-600">•</span>
            <span>Choose a date</span>
            </div>
            <div className="flex items-center gap-2">
             <span className="text-blue-600">•</span>
             <span>Pick an available time slot</span>
            </div>
            <div className="flex items-center gap-2">
             <span className="text-blue-600">•</span>
             <span>Enter your details to confirm the booking</span>
           </div>
         </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule your time</h2>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {selectedDate && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Available Slots
              </h2>

              {slots.length === 0 ? (
                <p className="text-gray-500">No slots available for the selected date.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setShowForm(true);
                        setSuccessMessage("");
                        setErrorMessage("");
                      }}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        selectedSlot?.start === slot.start && selectedSlot?.end === slot.end
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                    >
                      {slot.start} - {slot.end}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {showForm && selectedSlot && (
            <div className="space-y-4 mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Selected Slot: {selectedSlot.start} - {selectedSlot.end}
              </h2>

              <input
                type="text"
                placeholder="Your Name"
                value={inviteeName}
                onChange={(e) => setInviteeName(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Your Email"
                value={inviteeEmail}
                onChange={(e) => setInviteeEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleBooking}
                className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition"
              >
                Confirm Booking
              </button>
            </div>
          )}

          {successMessage && (
            <p className="text-green-600 mt-4 font-medium">{successMessage}</p>
          )}

          {errorMessage && (
            <p className="text-red-600 mt-4 font-medium">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);
  }