from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class EventType(Base):
    __tablename__ = "event_types"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # ForeignKey("users.id") → links this to the users table

    name = Column(String(100), nullable=False)
    slug = Column(String(150), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    # Longer explanation about the event
    duration_minutes = Column(Integer, nullable=False)
    # duration of the event
    is_active = Column(Boolean, default=True)
    # enable/disable an event type without deleting it
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # Stores when the event type was created
    # Automatically filled by database