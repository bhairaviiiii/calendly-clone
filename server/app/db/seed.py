from app.core.database import SessionLocal
#connects to the database
from app.models.user import User
from app.models.event_type import EventType
# import tables- user and event_types

db = SessionLocal()
# creates a database session

# Create default user
user = User(
    name="Demo User",
    email="demo@example.com"
)

db.add(user)
# adds user to the session
db.commit()
# writes data in mysql
db.refresh(user)
# Reloads user from DB

# Create event types
event1 = EventType(
    user_id=user.id,
    name="15 Min Intro Call",
    slug="15-min-intro",
    description="Quick introduction meeting",
    duration_minutes=15
)

event2 = EventType(
    user_id=user.id,
    name="30 Min Project Discussion",
    slug="30-min-discussion",
    description="Detailed discussion about project",
    duration_minutes=30
)

event3 = EventType(
    user_id=user.id,
    name="60 Min Consultation",
    slug="60-min-consultation",
    description="Full consultation session",
    duration_minutes=60
)

db.add_all([event1, event2, event3])
db.commit()
# events added to the database

print("Seed data inserted successfully!")