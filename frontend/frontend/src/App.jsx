import React, { useState } from "react";

export default function App() {
  const [showMoodModal, setShowMoodModal] = useState(true);
  const [selectedMood, setSelectedMood] = useState("");
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const getQuoteByMood = async (mood) => {
    setError(null);
    setQuote(null);
    setExplanation("");
    setSelectedMood(mood);
    setShowMoodModal(false);

    try {
      const res = await fetch(`http://localhost:8000/quote?moods=${encodeURIComponent(mood)}`);
      if (!res.ok) throw new Error("Failed to fetch quote");
      const data = await res.json();
      setQuote(data);

      // fetch teh explanation using the quote data
      await fetchExplanation (data.quote, data.philosopher, mood);
    } catch (err) {
      setError("Failed to fetch quote. Please try again.");
      setShowMoodModal(true);
    }
  };

  const fetchExplanation = async (quoteText, philosopher, mood) => {
    setLoadingExplanation(true);
    setExplanation("");

    try {
      const response = await fetch("http://localhost:8000/explain", {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quote: quoteText,
          philosopher,
          mood
        })
      });
      if (!response.ok) throw new Error("Failed to fetch explanation");
      const data = await response.json();
      setExplanation(data.explanation);
  } catch(err) {
    setExplanation("Sorry, explanation unvailable")
  } finally {
    setLoadingExplanation(false);
    }
  };

  const closeModal = () => setShowMoodModal(false);
  
  const moods = [
    "Burnout",
    "Disillusionment",
    "Powerlessness",
    "Imposter Syndrome",
    "Fear of Failure",
    "Loneliness",
    "Self-Doubt"
  ];

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Philosophy Quotes by Mood</h1>
        <p className="subtitle">Select a mood to inspire your day</p>
      </header>

      {showMoodModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          onClick={(e) => {
            if (e.target.classList.contains("modal-overlay")) closeModal();
          }}
        >
          <div className="mood-modal">
            <button
              aria-label="Close mood selection"
              className="close-btn"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 id="modalTitle">Choose Your Mood</h3>
            <div className="mood-buttons">
              {moods.map((mood) => (
                <button
                  key={mood}
                  className="mood-btn"
                  onClick={() => getQuoteByMood(mood)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      getQuoteByMood(mood);
                    }
                  }}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        {error && <p className="error-message">{error}</p>}

        {quote && (
          <>
            <section className="quote-display" aria-live="polite" aria-atomic="true">
              <p className="quote-text">“{quote.quote}”</p>
              <p className="philosopher-name">— {quote.philosopher}</p>
            </section>

            {quote.image && (
              <div className="philosopher-info">
                <img
                  src={quote.image}
                  alt={`Portrait of ${quote.philosopher}`}
                  className="philosopher-image"
                />
                <p className="philosopher-intro">{quote.info}</p>
              </div>
            )}

            <section className="explanation-section" aria-label="Quote explanation">
              <h3>Explanation</h3>
              <div className="explanation-text" dangerouslySetInnerHTML={{__html: explanation
                }} />
            </section>

            <div className="quote-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowMoodModal(true)}
                aria-label="Choose another mood"
              >
                Choose Another Mood
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
