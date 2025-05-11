#The front - desk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from pydantic import BaseModel
import routes
import random
import psycopg2

app = FastAPI()

# create tables in database
Base.metadata.create_all(bind=engine)

# include all the routes
app.include_router(routes.router)

#structure of the expected JSON
class QuoteInput(BaseModel):
    quote: str
    philosopher: str
    theme: str

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

# connect to postgres
conn = psycopg2.connect(
    dbname = 'stoic_quotes',
    user = 'postgres',
    password='2003',
    host='localhost',
    port='5432'
)

@app.get('/quote')
def get_random_quote():
    cur = conn.cursor()
    cur.execute("SELECT philosopher, quote FROM quotes")
    quotes = cur.fetchall()
    random_quote = random.choice(quotes)
    return {"philosopher" : random_quote[0], "quote" : random_quote[1]}

@app.get('/philosophers')
def get_philosophers():
    cur = conn.cursor()
    # cur.execute("")
    cur.execute("SELECT DISTINCT philosopher FROM quotes")
    philosophers = cur.fetchall()
    return {"philosophers" : [philosopher[0] for philosopher in philosophers]}

@app.post("/explain")
async def explain_quote(data: QuoteInput):
    #now we have access to the data
    quote = data.quote
    philosopher = data.philosopher
    theme = data.theme

    # Create the prompt 
    # Create your prompt to send to the LLM (placeholder logic for now)
    prompt = f"Explain the quote '{quote}' by {philosopher} in a {mood} and magical way."

    # (Optional) Here you can call an LLM or generate a dummy explanation for now
    explanation = f"(MAGICAL) {philosopher} might say: {quote} — Reflecting {mood.lower()} curiosity."

    # Return explanation back to frontend
    return {"explanation": explanation}