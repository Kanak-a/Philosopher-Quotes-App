#The front - desk
from fastapi import FastAPI
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from pydantic import BaseModel
import google.generativeai as genai
import routes
import markdown
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

@app.get("/moods")
def get_moods():
    cur = conn.cursor()
    cur.execute("SELECT mood_name from moods")
    moods = cur.fetchall()
    return {"moods": [mood[0] for mood in moods]}
@app.get('/quote')
def get_random_quote(mood: str = Query(None)):
    cur = conn.cursor()

    conn.rollback()
    if mood:
        cur.execute("""
            SELECT q.id, q.quote, p.name AS philosopher, m.mood_name AS mood
            FROM quotes q
            JOIN philosophers p ON q.philosopher_id = p.id
            JOIN quote_moods qm ON q.id = qm.quote_id
            JOIN moods m ON qm.mood_id = m.id
            WHERE m.mood_name = %s
    """, (mood, ))
        
    else:
        cur.execute("""
            SELECT q.id, q.quote, p.name AS philosopher, m.mood_name AS mood
            FROM quotes q 
            JOIN philosophers p ON q.philosopher_id = p.id
            JOIN quote_moods qm ON q.id = qm.quote_id
            JOIN moods m ON qm.mood_id = m.id
        """)
    quotes = cur.fetchall()
    
    if not quotes:
        return {"error" : "No quotes found for thsi mood!"}
    
    random_quote = random.choice(quotes)
    return {
        "quote_id": random_quote[0],
        "quote": random_quote[1],
        "philosopher": random_quote[2],
        "mood": random_quote[3]
    }

@app.post("/explain")
async def explain_quote(data: QuoteInput):
    try:
        quote = data.quote
        philosopher = data.philosopher
        mood = data.mood

        prompt = f"""
        You are a wise and emotionally intelligent guide who helps people reflect on life using timeless philosophical quotes.

        Quote: "{quote}"
        Philosopher: {philosopher}
        Current Mood/Challenge: {mood}

        Your job:
        - Use the quote and the mood selected to guide the person gently.
        - Do NOT explain the quote line by line. Instead, reflect on its meaning through storytelling, relatable real-life examples (e.g., work stress, heartbreak, loneliness, burnout), or everyday wisdom.
        - Talk like you're giving advice or perspective to someone who’s quietly struggling or thinking deeply.
        - Your tone should be friendly, emotionally grounded, and match the mood (e.g., soothing, uplifting, understanding).
        - Avoid any philosophical jargon. Don't name-drop the philosopher unless it adds value.
        - Write in **2 short paragraphs max**.
        - Do not use asterisks for *emphasis*. Use **bold** or _italic_ instead.
        - Output must be clear and clean — ready to be shown in a web app without formatting fixes.

        ---------------------------------------------------------------------------------------------------
        Below is the example of hwo to format the responses, keep it clean and concise and well formatted. Please follow the example below:
        It's okay to feel lost in thought sometimes. We all grapple with those existential questions, that nagging sense that things aren't quite... right. 

        **Kant's idea of the "crooked wood of humanity" really speaks to this.** We're all a bit flawed, a bit messy. We carry baggage, make mistakes, and hit rough patches.  
        That’s not failure — it’s just part of being human.
        > _You're not meant to be perfect. You're meant to be real. And that's more than enough._
        Bold and italics should be properly formatted before displaying. 
        Add breaks before and after the quote to make it stand out. Use a simple font and keep it clean.
        """


        # Example API call (replace with actual LLM API call)
        genai.configure(api_key = "AIzaSyBOcrrFAaupmPT-YS1HkJEUj-IAEgwyR4E")
        model = genai.GenerativeModel("gemini-1.5-flash") 
        
        response = model.generate_content(prompt)
        explanation_markdown = response.text

        # Convert markdown formatting to HTML
        explanation_html = markdown.markdown(explanation_markdown)

    except Exception as e:
        explanation = f"Error generating explanation: {str(e)}"

    return {"explanation": explanation_html}

