from sqlalchemy import Column, Integer, String, Boolean, Time
from app.core.database import Base #inheriting the base class

class Availability(Base):
    __tablename__ = "availability"

    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String(20), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    timezone = Column(String(100), nullable=False, default="Asia/Kolkata")
    is_active = Column(Boolean, default=True)