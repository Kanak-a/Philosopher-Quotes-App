#The front - desk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from pydantic import BaseModel
import google.generativeai as genai
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
    mood: str


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
    try:
        quote = data.quote
        philosopher = data.philosopher
        mood = data.mood

        prompt = f"""
        You are a philosophical guide presenting timeless wisdom in a clear and supportive way.

        Quote: "{quote}"
        Philosopher: {philosopher}
        Mood: {mood}

        Your task is to explain the deeper meaning of this quote based on the selected mood. Keep the explanation short, emotionally grounding, and easy to understand—no storytelling or dialogue. Present the core message as if giving guidance to someone looking for clarity or personal growth.

        Make sure to:
        - Reflect the philosopher's core beliefs
        - Keep paragraphs short and simple
        - Use bullet points if helpful
        - Include relatable modern-day examples if needed
        - Focus on actionable or insightful life lessons

        Write like a wise teacher, not a poet. Aim to help the reader learn and apply the idea.
        """



        # Example API call (replace with actual LLM API call)
        genai.configure(api_key = "AIzaSyBOcrrFAaupmPT-YS1HkJEUj-IAEgwyR4E")
        model = genai.GenerativeModel("gemini-1.5-flash") 
        
        response = model.generate_content(prompt)
        explanation = response.text

    except Exception as e:
        explanation = f"Error generating explanation: {str(e)}"

    return {"explanation": explanation}

