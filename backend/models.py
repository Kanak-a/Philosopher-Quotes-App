from sqlalchemy import Column, Integer, String
from database import Base

class Quote(Base):
    __tablename__ = 'quotes'

    id = Column(Integer, primary_key=True, index=True)
    philosopher = Column(String, index=True)
    quote = Column(String)
    