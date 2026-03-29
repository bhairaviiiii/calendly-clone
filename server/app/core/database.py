from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import URL
from dotenv import load_dotenv
from pathlib import Path
import os

#The following line find the env file location
env_path = Path(__file__).resolve().parents[2] / ".env"

load_dotenv(dotenv_path=env_path) 
# this line will load all the variables from .env file to the program

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
#These lines get values from .env file

DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT), #since port was string so we'll convert it to int
    database=DB_NAME,
)

engine = create_engine(DATABASE_URL)
#Creates an actual connection to the database
SessionLocal = sessionmaker(bind=engine)
#Whenever you call sessionlocal() you will get a new DB session

Base= declarative_base()
#used to define database models and here base will be parent class and all models will inherit from this

def get_db():#dependency function or injection
#get_db()- it returns a database session
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    #db connection is always closed after use