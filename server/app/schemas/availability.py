from pydantic import BaseModel
from datetime import time

class AvailabilityCreate(BaseModel):
    day_of_week: str
    start_time: time
    end_time: time
    timezone: str
    is_active: bool = True #structure of the availability table