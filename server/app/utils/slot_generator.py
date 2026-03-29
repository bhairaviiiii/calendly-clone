from datetime import datetime, timedelta, time
#timedelta → add/subtract time (like +30 mins)

def generate_time_slots(start_time, end_time, duration_minutes):
    # start_time → when availability starts (e.g., 09:00)
    # end_time → when availability ends (e.g., 17:00)
    # duration_minutes → meeting length (e.g., 30)

    slots = []
    # This will store all generated time slots

    today = datetime.today().date() #get today's date
    current = datetime.combine(today, start_time)
    end = datetime.combine(today, end_time)
    # Converts time → full datetime (09:00 → 2026-03-29 09:00)

    while current + timedelta(minutes=duration_minutes) <= end:
        slot_end = current + timedelta(minutes=duration_minutes)
        # current = 09:00, duration = 30 min → slot_end = 09:30

        slots.append({
            "start": current.strftime("%H:%M"),
            "end": slot_end.strftime("%H:%M")
        }) #Converts time to string

        current = slot_end

    return slots
# returns all generated slots