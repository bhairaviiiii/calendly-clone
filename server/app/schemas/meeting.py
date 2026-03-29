from pydantic import BaseModel
from datetime import datetime

class MeetingCreate(BaseModel):
    event_type_id: int
    invitee_name: str
    invitee_email: str
    start_datetime: datetime
    end_datetime: datetime