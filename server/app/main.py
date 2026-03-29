from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models import user, event_type, meetings, availability
from app.routes.event_types import router as event_types_router
from app.routes.meeting import router as meeting_router
from app.routes.availability import router as availability_router

app = FastAPI()

app.add_middleware( #helps to allow requests from frontend
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
# look at all models connected to Base
# create corresponding tables in MySQL if they do not already exist

app.include_router(event_types_router)
# It includes all the APIs defined in event_types_router into the main app

app.include_router(meeting_router)
# It includes all the APIs defined in meeting_router into the main app

app.include_router(availability_router)
# It includes all the APIs defined in availability_router into the main app

@app.get("/")
def home():
    return {"message": "Backend is running successfully"}

@app.get("/test-db")
def test_db():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"message": "Database connected successfully"}
    except Exception as e:
        return {"error": str(e)}