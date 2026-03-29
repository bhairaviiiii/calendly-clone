from fastapi import APIRouter, Depends, HTTPException
# APIRouter → lets you create grouped routes (like mini apps)
# Depends → used for dependency injection (DB connection)
# HTTPException → for returning errors

from sqlalchemy.orm import Session
# Session → DB session type

from app.core.database import get_db
# get_db → function that gives DB connection

from app.models.event_type import EventType # db table
from app.schemas.event_type import EventTypeCreate, EventTypeUpdate, EventTypeResponse
from typing import List #List → return multiple items

router = APIRouter(prefix="/event-types", tags=["Event Types"])
# All routes will start with /event-types
# Group name in Swagger UI = Event Types

DEFAULT_USER_ID = 1 #instead of authentication, here the default value is 1

@router.get("/", response_model=List[EventTypeResponse]) #get response values
def get_event_types(db: Session = Depends(get_db)):#provides database connection
    return db.query(EventType).filter(EventType.user_id == DEFAULT_USER_ID).all()
# this query will fetch all the events where user_id =1, here all()- returns list

@router.post("/", response_model=EventTypeResponse) #creates an event
def create_event_type(payload: EventTypeCreate, db: Session = Depends(get_db)):
    # Validates request body using EventTypeCreate
    existing_slug = db.query(EventType).filter(EventType.slug == payload.slug).first()
    if existing_slug:
        raise HTTPException(status_code=400, detail="Slug already exists")
    # checks if the slug already exists and if it does it gives an error
    # prevent duplicate urls

    new_event = EventType(
        user_id=DEFAULT_USER_ID,
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        duration_minutes=payload.duration_minutes,
        is_active=payload.is_active,
    ) #Convert schema → DB model

    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event #Automatically converted to response schema

@router.put("/{event_id}", response_model=EventTypeResponse) #{event_id} = dynamic URL parameter
def update_event_type(event_id: int, payload: EventTypeUpdate, db: Session = Depends(get_db)):
    event = db.query(EventType).filter(EventType.id == event_id).first()
    # fetches thode events which have the same id as the event_id(entered by the user)
    
    if not event:
        raise HTTPException(status_code=404, detail="Event type not found")
    # if there is no such event which has the event_id then give error
    
    slug_owner = db.query(EventType).filter(EventType.slug == payload.slug, EventType.id != event_id).first()
    # Check if another event already has same slug
    # if there exists such slug then give error
    if slug_owner:
        raise HTTPException(status_code=400, detail="Slug already exists")

    event.name = payload.name #Payload = the data sent by the client to the server
    event.slug = payload.slug
    event.description = payload.description
    event.duration_minutes = payload.duration_minutes
    event.is_active = payload.is_active

    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}")
def delete_event_type(event_id: int, db: Session = Depends(get_db)):
    event = db.query(EventType).filter(EventType.id == event_id).first()
    #gets the event with the required event_id 
    if not event:
        raise HTTPException(status_code=404, detail="Event type not found")
    
    # if the event exists, it will be deleted
    db.delete(event)
    db.commit()
    return {"message": "Event type deleted successfully"}

@router.get("/{slug}")
def get_event_type_by_slug(slug: str, db: Session = Depends(get_db)):
    event_type = db.query(EventType).filter(EventType.slug == slug).first()

    if not event_type:
        raise HTTPException(status_code=404, detail="Event type not found")

    return event_type