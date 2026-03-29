from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from app.core.database import Base
import enum
# enum module → used to define fixed choices.

class MeetingStatus(str, enum.Enum):
    scheduled = "scheduled"
    cancelled = "cancelled"
    #creates fixed set of values for meeting status

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    event_type_id = Column(Integer, ForeignKey("event_types.id"), nullable=False)
    # Tells: which type of event this meeting is
    # connects it to the event_type table
    
    host_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # Links to users table
    # Represents the host (person who created the meeting)

    invitee_name = Column(String(100), nullable=False)
    # Name of the person who booked the meeting
    invitee_email = Column(String(150), nullable=False)
    start_datetime = Column(DateTime, nullable=False)
    # when meeting starts
    end_datetime = Column(DateTime, nullable=False)
    # when meeting ends
    status = Column(Enum(MeetingStatus), default=MeetingStatus.scheduled)
    created_at = Column(DateTime(timezone=True), server_default=func.now())