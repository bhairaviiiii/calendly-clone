from fastapi import APIRouter, Depends, HTTPException, Query
 #APIRouter → create routes, Depends → inject dependencies 
#  query--this value comes from query parameters
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.database import SessionLocal
from app.models.availability import Availability #availability table
from app.schemas.availability import AvailabilityCreate
from app.models.meetings import Meeting, MeetingStatus
from app.models.event_type import EventType
from app.utils.slot_generator import generate_time_slots

router = APIRouter(prefix="/availability", tags=["Availability"])
# In Swagger UI, they appear under “Availability”

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_availability(payload: AvailabilityCreate, db: Session = Depends(get_db)):
    print("Received payload:", payload)

    availability = Availability(
        day_of_week=payload.day_of_week,
        start_time=payload.start_time,
        end_time=payload.end_time,
        timezone=payload.timezone,
        is_active=payload.is_active
    )

    db.add(availability)
    db.commit()
    db.refresh(availability)
    print("Saved availability ID:", availability.id)

    return {
        "message": "Availability created successfully",
        "availability": availability
    }

@router.get("/")
def get_availability(db: Session = Depends(get_db)):
    return db.query(Availability).all() 

@router.get("/slots")
def get_available_slots(
    event_type_id: int = Query(...),
    date: str = Query(...),
    db: Session = Depends(get_db)
): #event_type_id → required query parameter, date → required query parameter
# db → database connection

    # convert date string to actual date object
    try:
        selected_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    # if format is wrong it will throw an error

    weekday = selected_date.strftime("%A")   # Monday, Tuesday, etc.
# Converts date → weekday

    # get event type-- event details and duration of meeting
    event_type = db.query(EventType).filter(EventType.id == event_type_id).first()
    if not event_type:
        raise HTTPException(status_code=404, detail="Event type not found")

    # get availability for that weekday
    availability = db.query(Availability).filter(
        Availability.day_of_week == weekday,
        Availability.is_active == True
    ).first()

    if not availability:
        return []

    slots = generate_time_slots( #generate slots
        availability.start_time,
        availability.end_time,
        event_type.duration_minutes
    )

    day_start = selected_date.replace(hour=0, minute=0, second=0, microsecond=0)
    day_end = day_start + timedelta(days=1)
    # defines the full selected day

    booked_meetings = db.query(Meeting).filter(
        Meeting.event_type_id == event_type_id,
        Meeting.status == MeetingStatus.scheduled,
        Meeting.start_datetime >= day_start,
        Meeting.start_datetime < day_end
    ).all()
    # gets all already-booked meetings for that event type on that date.

    booked_start_times = {
        meeting.start_datetime.strftime("%H:%M") for meeting in booked_meetings
    } #stores the booked slot start times.

    available_slots = [
        slot for slot in slots if slot["start"] not in booked_start_times
    ] #removes those booked slots.

    return available_slots