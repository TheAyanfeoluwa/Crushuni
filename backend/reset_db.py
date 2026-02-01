"""
Database Reset Script
This script will:
1. Drop the users table (and related data due to foreign key constraints)
2. Recreate all tables with the new schema (first_name, last_name instead of full_name)

WARNING: This will delete ALL existing user data, decks, flashcards, concepts, and study activities!
"""

from database import Base, engine

def reset_database():
    print("WARNING: This will delete ALL data in the database!")
    confirm = input("Type 'YES' to confirm: ")
    
    if confirm != "YES":
        print("Aborted.")
        return
    
    print("\nDropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Tables dropped successfully!")
    
    print("\nCreating new tables with updated schema...")
    Base.metadata.create_all(bind=engine)
    
    print("Database reset complete!")
    print("\nNew User table schema:")
    print("  - id (Integer, Primary Key)")
    print("  - email (String, Unique)")
    print("  - first_name (String)")
    print("  - last_name (String)")
    print("  - hashed_password (String)")
    print("  - created_at (DateTime)")
    print("\nYou can now register new users with first_name and last_name fields.")

if __name__ == "__main__":
    reset_database()
