from datetime import time

from app.core.database import SessionLocal
from app.models.user import User
from app.models.event_type import EventType
from app.models.availability import Availability


db = SessionLocal()

try:
    # Create or reuse default user
    user = db.query(User).filter_by(email="demo@example.com").first()

    if not user:
        user = User(name="Demo User", email="demo@example.com")
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create event types safely
    event_types_data = [
        {
            "name": "15 Min Intro Call",
            "slug": "15-min-intro",
            "description": "Quick introduction meeting",
            "duration_minutes": 15,
        },
        {
            "name": "30 Min Project Discussion",
            "slug": "30-min-discussion",
            "description": "Detailed discussion about project",
            "duration_minutes": 30,
        },
        {
            "name": "60 Min Consultation",
            "slug": "60-min-consultation",
            "description": "Full consultation session",
            "duration_minutes": 60,
        },
    ]

    for event in event_types_data:
        existing_event = db.query(EventType).filter_by(slug=event["slug"]).first()

        if not existing_event:
            new_event = EventType(
                user_id=user.id,
                name=event["name"],
                slug=event["slug"],
                description=event["description"],
                duration_minutes=event["duration_minutes"],
                is_active=True,
            )
            db.add(new_event)

    db.commit()

    # Create availability safely
    availability_data = [
        ("Monday", time(9, 0), time(17, 0)),
        ("Tuesday", time(9, 0), time(17, 0)),
        ("Wednesday", time(10, 0), time(16, 0)),
        ("Thursday", time(9, 0), time(17, 0)),
        ("Friday", time(11, 0), time(15, 0)),
    ]

    for day, start, end in availability_data:
        existing_availability = (
            db.query(Availability)
            .filter_by(
                day_of_week=day,
                start_time=start,
                end_time=end,
                timezone="Asia/Kolkata",
            )
            .first()
        )

        if not existing_availability:
            new_availability = Availability(
                day_of_week=day,
                start_time=start,
                end_time=end,
                timezone="Asia/Kolkata",
                is_active=True,
            )
            db.add(new_availability)

    db.commit()

    print("Seed data inserted safely!")

except Exception as e:
    db.rollback()
    print("Error while inserting seed data:", e)

finally:
    db.close()