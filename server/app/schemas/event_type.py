from pydantic import BaseModel
# Pydantic = Data Validation Layer
# it mainly:
# Ensures correct data types
# Prevents bad input
# Converts data automatically
# used to create data validation schemas

from typing import Optional
# means a field can be empty

# Client sends data to create a new event type (POST request)
class EventTypeCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    duration_minutes: int
    is_active: bool = True

# This is for Updating an event (PUT)
class EventTypeUpdate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    duration_minutes: int
    is_active: bool = True

# Sending data from backend → frontend (GET response)
class EventTypeResponse(BaseModel):
    id: int
    user_id: int
    name: str
    slug: str
    description: Optional[str]
    duration_minutes: int
    is_active: bool

    class Config:
        from_attributes = True
        # Allows Pydantic to convert SQLAlchemy object → JSON
        # without this line it will give an error like- object is not iterable
        # with this you can directly return db objects