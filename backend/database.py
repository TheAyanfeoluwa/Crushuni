from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime, date

import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    decks = relationship("Deck", back_populates="owner")
    concepts = relationship("Concept", back_populates="owner")
    study_activities = relationship("StudyActivity", back_populates="user")

class Deck(Base):
    __tablename__ = "decks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    category = Column(String, index=True, default="General")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="decks")
    cards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    deck_id = Column(Integer, ForeignKey("decks.id"))
    front = Column(String)
    back = Column(String)
    
    deck = relationship("Deck", back_populates="cards")

class Concept(Base):
    __tablename__ = "concepts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    summary = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="concepts")

class StudyActivity(Base):
    __tablename__ = "study_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    activity_date = Column(Date, default=date.today)
    deck_id = Column(Integer, ForeignKey("decks.id"), nullable=True)
    cards_reviewed = Column(Integer, default=0)
    easy_count = Column(Integer, default=0)
    hard_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="study_activities")

def init_db():
    Base.metadata.create_all(bind=engine)

