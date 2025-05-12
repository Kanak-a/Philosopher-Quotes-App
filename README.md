# Quote Explorer

**Find timeless wisdom for modern moods.** This app brings philosophical quotes to life by interpreting them based on your emotional state.

---

## 🌟 What It Does

* Fetches powerful quotes from legendary philosophers.
* Lets users select their current **mood** (e.g., anxious, burnt out, self-doubt).
* Uses AI to give a **concise, modern, and emotionally-resonant explanation** of the quote.
* Tailors the explanation to your chosen mood — like having a wise friend explain timeless wisdom.

---

## 🚀 Live Demo

> *Coming soon* (or insert link if deployed)

---

## 🛠️ Tech Stack

**Frontend**

* React
* Framer Motion (for smooth transitions)

**Backend**

* FastAPI (Python)
* OpenAI or Gemini LLM API

---

## 📦 Installation

```bash
# Clone the repo
$ git clone https://github.com/yourusername/quote-explorer.git
$ cd quote-explorer

# Frontend setup
$ cd frontend
$ npm install
$ npm start

# Backend setup
$ cd ../backend
$ pip install -r requirements.txt
$ uvicorn main:app --reload
```

---

## 🧠 Example Flow

1. User clicks "Get a Quote"
2. Selects their mood: *e.g., "Anxious"*
3. Gets an explanation of the quote in a tone that feels calming, personal, and relevant

---

## 📁 Folder Structure

```plaintext
/quotes_app
├── frontend
│   └── (React files)
├── backend
│   └── main.py
├── assets/
│   └── screenshots, icons
├── .env.example
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend root with:

```env
OPENAI_API_KEY=your_key_here
```

---

## 💡 Future Ideas

* Add voice input for quote explanation
* More moods & mental health states
* Daily wisdom notifications
* Save favorite quotes

---

## 🤝 Contributing

Pull requests are welcome! Open issues or suggest ideas to improve.

---

## 📜 License

MIT License

---

## 🙏 Acknowledgements

Inspired by a love for philosophy and a desire to make old wisdom relatable in today's fast-paced world.

---

> *"Man is nothing else but what he makes of himself." — Jean-Paul Sartre*
