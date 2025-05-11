from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Quote

router = APIRouter()

@router.get("/quotes/")
def get_all_quotes(db: Session = Depends(get_db)):
    return db.query(Quote).all()

@router.get("/quotes/{philosopher}")
def get_quote_by_philosopher(philosopher: str, db: Session = Depends(get_db)):
    return db.query(Quote).filter(Quote.philosopher == philosopher).all()