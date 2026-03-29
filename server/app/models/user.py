from sqlalchemy import Column, Integer, String, DateTime
#to have different types of values
from sqlalchemy.sql import func
#func.now() is used to get the current date and time from database
from app.core.database import Base
#this imports the base class from the database.py file
# That tells SQLAlchemy that this class represents a database table

class User(Base):#user is the python model which inherits from base
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # server_default=func.now() → when a new user is added, 
    # the database automatically fills the current date and time
    # so you need not to fill this column manually