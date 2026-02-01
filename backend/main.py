from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import text
from pydantic import BaseModel, Field
import os
from google import genai
from dotenv import load_dotenv
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt

from database import SessionLocal, engine, init_db, Deck, Flashcard, Concept, User, StudyActivity
from file_processing import extract_text_from_file
#I just added this line to test git
load_dotenv()

# Initialize DB
init_db()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration ---
GENAI_API_KEY = os.getenv("GENAI_API_KEY")


SECRET_KEY = os.getenv("SECRET_KEY", "YOUR_SUPER_SECRET_KEY_HERE")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 Days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# --- Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Auth Utilities ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# --- Pydantic Models ---
class UserCreate(BaseModel):
    email: str
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str

class ChatRequest(BaseModel):
    message: str
    context: str = ""

# --- Auth API ---

@app.post("/api/auth/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, first_name=user.first_name, last_name=user.last_name, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer", "user_name": new_user.first_name}

@app.post("/api/auth/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user_name": user.first_name or user.email.split('@')[0]}

@app.get("/api/auth/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name
    }

# --- Core API (Secured) ---

@app.get("/")
def read_root():
    return {"message": "CrushUni Backend is Running"}

@app.get("/heartbeat")
def heartbeat(db: Session = Depends(get_db)):
    try:
        # Run a simple query to keep the connection active
        db.execute(text("SELECT 1"))
        return {"status": "alive", "database": "connected"}
    except Exception as e:
        return {"status": "alive", "database": "error", "details": str(e)}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest, current_user: User = Depends(get_current_user)):
    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    
    try:
        client = genai.Client(api_key=GENAI_API_KEY)
        response = client.models.generate_content(
            model='gemini-2.5-flash', contents=request.message,
            config={'system_instruction': request.context}
        )
        return {"response": response.text}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/flashcards/generate")
async def generate_flashcards(
    file: UploadFile | None = File(None),
    text_input: str | None = Form(None),
    num_cards: int = Form(...),
    title: str = Form(...),
    category: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not GENAI_API_KEY:
         raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    try:
        # 1. Read and Extract Text
        content_text = ""
        if file:
            content = await file.read()
            content_text = extract_text_from_file(content, file.filename)
        elif text_input:
            content_text = text_input
        else:
             raise HTTPException(status_code=400, detail="No file or text provided")
        
        # 2. Call Gemini
        client = genai.Client(api_key=GENAI_API_KEY)
        
        prompt = f"""
        You are an expert tutor. Create exactly {num_cards} flashcards based ONLY on the text provided below within the <source_text> tags.
        
        Strictly follow this format for every card:
        Q: [Question] | A: [Answer]
        ###
        
        Use '###' as a separator between cards. Do not include any intro or outro text.
        
        <source_text>
        {content_text[:30000]} 
        </source_text>
        """ 
        
        response = client.models.generate_content(
            model='gemini-2.5-flash', contents=prompt
        )
        generated_text = response.text
        
        # 3. Parse Response
        cards = []
        raw_cards = generated_text.split('###')
        
        # LINK TO CURRENT USER
        created_deck = Deck(title=title, category=category, user_id=current_user.id)
        db.add(created_deck)
        db.commit()
        db.refresh(created_deck)
        
        for raw in raw_cards:
            if 'Q:' in raw and '| A:' in raw:
                cleaned = raw.strip()
                if not cleaned: continue
                
                parts = cleaned.split('| A:')
                question = parts[0].replace('Q:', '').strip()
                answer = parts[1].strip()
                
                flashcard = Flashcard(deck_id=created_deck.id, front=question, back=answer)
                db.add(flashcard)
        
        db.commit()
        
        return {"deck_id": created_deck.id, "message": "Deck created successfully"}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/decks")
def get_decks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Filter by user_id
    decks = db.query(Deck).filter(Deck.user_id == current_user.id).order_by(Deck.created_at.desc()).all()
    return decks

@app.get("/api/decks/{deck_id}")
def get_deck(deck_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Ensure user owns the deck
    deck = db.query(Deck).options(joinedload(Deck.cards)).filter(Deck.id == deck_id, Deck.user_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    return deck

@app.post("/api/extract")
async def extract_content(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    try:
        content = await file.read()
        text = extract_text_from_file(content, file.filename)
        return {"text": text, "filename": file.filename}
    except Exception as e:
        print(f"Error extracting text: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract text from file")

@app.post("/api/concepts/generate")
async def generate_concept(
    file: UploadFile | None = File(None),
    text_input: str | None = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not GENAI_API_KEY:
         raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    try:
        source_text = ""
        title = "New Concept Extraction"

        if file:
            content = await file.read()
            source_text = extract_text_from_file(content, file.filename)
            title = f"Concepts from {file.filename}"
        elif text_input:
            source_text = text_input
            title = f"Concepts from Text ({datetime.utcnow().strftime('%Y-%m-%d %H:%M')})"
        else:
             raise HTTPException(status_code=400, detail="No file or text provided")

        client = genai.Client(api_key=GENAI_API_KEY)
       
        prompt = f"""
        You are an expert academic summarizer. Extract the core concepts based ONLY on the text provided below within the <source_text> tags.
        
        Provide a structured summary with the following HTML-compatible format (using simple markers):
        
        # [Concept Title]
        [Brief Explanation]
        
        * Key Point 1
        * Key Point 2
        
        --NEXT--
        
        (Repeat for major concepts)
        
        <source_text>
        {source_text[:30000]}
        </source_text>
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash', contents=prompt
        )
        summary_text = response.text
        
        # LINK TO USER
        new_concept = Concept(title=title, summary=summary_text, user_id=current_user.id)
        db.add(new_concept)
        db.commit()
        db.refresh(new_concept)
        
        return {"concept_id": new_concept.id, "message": "Concept extracted successfully"}

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/concepts")
def get_concepts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Concept).filter(Concept.user_id == current_user.id).order_by(Concept.created_at.desc()).all()

@app.get("/api/concepts/{concept_id}")
def get_concept(concept_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    concept = db.query(Concept).filter(Concept.id == concept_id, Concept.user_id == current_user.id).first()
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    return concept

# --- Study Activity API ---

class StudyLogRequest(BaseModel):
    deck_id: int
    cards_reviewed: int
    easy_count: int = 0
    hard_count: int = 0

@app.post("/api/study/log")
def log_study_activity(request: StudyLogRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from datetime import date
    today = date.today()
    
    # Check if there's already an activity for this deck today
    existing = db.query(StudyActivity).filter(
        StudyActivity.user_id == current_user.id,
        StudyActivity.deck_id == request.deck_id,
        StudyActivity.activity_date == today
    ).first()
    
    if existing:
        # Update existing record
        existing.cards_reviewed += request.cards_reviewed
        existing.easy_count += request.easy_count
        existing.hard_count += request.hard_count
    else:
        # Create new activity record
        new_activity = StudyActivity(
            user_id=current_user.id,
            deck_id=request.deck_id,
            activity_date=today,
            cards_reviewed=request.cards_reviewed,
            easy_count=request.easy_count,
            hard_count=request.hard_count
        )
        db.add(new_activity)
    
    db.commit()
    return {"message": "Study activity logged successfully"}

def calculate_study_streak(db: Session, user_id: int) -> int:
    from datetime import date, timedelta
    from sqlalchemy import func
    
    # Get distinct study dates for user, ordered by date descending
    study_dates = db.query(func.distinct(StudyActivity.activity_date)).filter(
        StudyActivity.user_id == user_id
    ).order_by(StudyActivity.activity_date.desc()).all()
    
    if not study_dates:
        return 0
    
    study_dates = [d[0] for d in study_dates]
    today = date.today()
    
    # Check if user studied today or yesterday (allow 1 day grace)
    if study_dates[0] != today and study_dates[0] != today - timedelta(days=1):
        return 0
    
    # Count consecutive days
    streak = 0
    expected_date = study_dates[0]
    
    for study_date in study_dates:
        if study_date == expected_date:
            streak += 1
            expected_date = study_date - timedelta(days=1)
        elif study_date < expected_date:
            break
    
    return streak

@app.get("/api/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from datetime import date, timedelta
    from sqlalchemy import func
    
    # Filter ALL stats by user_id
    deck_count = db.query(Deck).filter(Deck.user_id == current_user.id).count()
    flashcard_count = db.query(Flashcard).join(Deck).filter(Deck.user_id == current_user.id).count()
    concept_count = db.query(Concept).filter(Concept.user_id == current_user.id).count()
    
    # Calculate real study streak
    study_streak = calculate_study_streak(db, current_user.id)
    
    # Calculate weekly trends
    today = date.today()
    week_ago = today - timedelta(days=7)
    two_weeks_ago = today - timedelta(days=14)
    
    # Cards reviewed this week vs last week
    this_week_cards = db.query(func.coalesce(func.sum(StudyActivity.cards_reviewed), 0)).filter(
        StudyActivity.user_id == current_user.id,
        StudyActivity.activity_date >= week_ago
    ).scalar() or 0
    
    last_week_cards = db.query(func.coalesce(func.sum(StudyActivity.cards_reviewed), 0)).filter(
        StudyActivity.user_id == current_user.id,
        StudyActivity.activity_date >= two_weeks_ago,
        StudyActivity.activity_date < week_ago
    ).scalar() or 0
    
    cards_trend = int(this_week_cards) - int(last_week_cards)
    
    recent_decks = db.query(Deck).filter(Deck.user_id == current_user.id).order_by(Deck.created_at.desc()).limit(3).all()
    recent_concepts = db.query(Concept).filter(Concept.user_id == current_user.id).order_by(Concept.created_at.desc()).limit(3).all()
    
    return {
        "stats": {
            "total_decks": deck_count,
            "total_flashcards": flashcard_count,
            "total_concepts": concept_count,
            "study_streak": study_streak,
            "cards_trend": cards_trend,
            "consistency_score": min(100, study_streak * 15) if study_streak > 0 else 0
        },
        "recent_activity": {
             "decks": recent_decks,
             "concepts": recent_concepts
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

