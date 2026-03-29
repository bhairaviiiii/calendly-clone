const BASE_URL = "http://127.0.0.1:8000";

export async function getEventTypes() {
    // An async function is a function that:
    // works with time-taking operations (like API calls) and allows you to await inside it


  const res = await fetch(`${BASE_URL}/event-types/`);
// sends a get req to the url- this will hit the fastAPI route & it will
// wait until reponse comes

  if (!res.ok) { //res.ok means it status 200-299 basically success 
    throw new Error("Failed to fetch event types");
  }

  return res.json(); //Convert Response to JSON (usable format)
}

export async function getEventTypeBySlug(slug: string) {
  const res = await fetch(`${BASE_URL}/event-types/${slug}`);

  if (!res.ok) {
    throw new Error("Failed to fetch event type");
  }

  return res.json();
}

export async function createMeeting(meetingData: any) {
  const res = await fetch(`${BASE_URL}/meetings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meetingData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to create meeting");
  }

  return res.json();
}

export async function createAvailability(data: any) {
  const res = await fetch(`${BASE_URL}/availability/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Backend error:", errorText);
    throw new Error("Failed to create availability");
  }

  return res.json();
}

export async function getAvailability() {
  const res = await fetch(`${BASE_URL}/availability/`);

  if (!res.ok) {
    throw new Error("Failed to fetch availability");
  }

  return res.json();
}

export async function getAvailableSlots(eventTypeId: number, date: string) {
  const res = await fetch(
    `${BASE_URL}/availability/slots?event_type_id=${eventTypeId}&date=${date}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch slots");
  }

  return res.json();
}