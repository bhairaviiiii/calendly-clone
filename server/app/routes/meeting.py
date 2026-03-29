from fastapi import APIRouter, Depends, HTTPException #APIRouter → create routes, Depends → inject dependencies 
from sqlalchemy.orm import Session #Session → database session type
from app.core.database import SessionLocal #SessionLocal → function to create DB connection
from app.models.meetings import Meeting, MeetingStatus # Meeting → your meetings table
# MeetingStatus → enum (e.g., scheduled, cancelled)
from app.schemas.meeting import MeetingCreate
from app.models.event_type import EventType

router = APIRouter(prefix="/meetings", tags=["Meetings"])
# In Swagger UI, they appear under “Meetings”

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_meeting(payload: MeetingCreate, db: Session = Depends(get_db)):

    # prevents double booking
    existing_meeting = db.query(Meeting).filter(
        Meeting.event_type_id == payload.event_type_id,
        Meeting.start_datetime == payload.start_datetime,
        Meeting.end_datetime == payload.end_datetime,
        Meeting.status == MeetingStatus.scheduled
    ).first()

    if existing_meeting:
        raise HTTPException(status_code=400, detail="This time slot is already booked")
    
    
    meeting = Meeting(
        event_type_id=payload.event_type_id,
        host_user_id=1,
        invitee_name=payload.invitee_name,
        invitee_email=payload.invitee_email,
        start_datetime=payload.start_datetime,
        end_datetime=payload.end_datetime,
        status=MeetingStatus.scheduled
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return {"message": "Meeting booked successfully", "meeting": meeting}

@router.get("/{meeting_id}")
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()

    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    event_type = db.query(EventType).filter(EventType.id == meeting.event_type_id).first()

    return {
        "id": meeting.id,
        "event_type_id": meeting.event_type_id,
        "event_name": event_type.name if event_type else None,
        "event_slug": event_type.slug if event_type else None,
        "duration_minutes": event_type.duration_minutes if event_type else None,
        "host_user_id": meeting.host_user_id,
        "invitee_name": meeting.invitee_name,
        "invitee_email": meeting.invitee_email,
        "start_datetime": meeting.start_datetime,
        "end_datetime": meeting.end_datetime,
        "status": meeting.status,
        "created_at": meeting.created_at,
    }
@router.get("/")
def get_all_meetings(db: Session = Depends(get_db)):
    meetings = db.query(Meeting).all()
    return meetings

@router.put("/{meeting_id}/cancel")
def cancel_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()

    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    meeting.status = MeetingStatus.cancelled
    db.commit()

    return {"message": "Meeting cancelled successfully"}