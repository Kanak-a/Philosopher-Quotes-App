import { useState } from "react";
import './App.css';
import { motion} from "framer-motion";
import { FaLightbulb } from "react-icons/fa";

function App() {
  const[quote, setQuote] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState(null);
  const [funFactIndex, setFunFactIndex] = useState(0);
  const [showMoodModal, setShowMoodModal] = useState(false);


  const getQuote = async () => {
    try {
      const res = await fetch('http://localhost:8000/quote');
      const data = await res.json();
      setQuote(data);
      setShowInfo(false);
      setError(null);
    } catch (error) {
        console.error("Error fetching quote:", error);
        setError("Failed to get quote. Please try again.");
        setQuote(null);
    }

  };

  
  const philosopherData = {
    "Aristotle": {
      image: "https://static01.nyt.com/images/2016/05/27/world/27ARISTOTLE/27ARISTOTLE-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
      funFacts: [
        "Aristotle believed that women had fewer teeth than men — and apparently never thought to check.",
        "Aristotle, who spent two decades as Plato's star pupil (though probably rolled his eyes a few times during lectures on the Forms), went on to tutor a guy famous for conquering the known world – talk about a career upgrade!",
        "There's a (likely apocryphal, but fun) story that Aristotle used a brass ball to help him stay focused. He'd hold it while thinking, and when he fell asleep, the ball would drop into a metal basin, waking him up to continue pondering. Talk about a low-tech productivity hack!",
        "He apparently had some interesting (and incorrect by today's standards) theories about why we sneeze, suggesting it was a way for the body to expel excess heat from the brain. So next time you sneeze, you can briefly imagine Aristotle thinking your head is overheating!"
      ]
    },
    "Plato":{
      image: "https://www.worldhistory.org/uploads/images/1165.jpg",
      funFacts: [
        "Plato wasn't actually his given name! His birth name was likely Aristocles. 'Plato' was a nickname, possibly given to him because of his broad shoulders (from the Greek word 'platys' meaning broad or wide) or perhaps due to his wide-ranging intellect. So, the philosophical superstar we know as Plato was rocking a nickname!",
        "Forget the image of the serene sage – there's a whisper in history that the man who pondered the abstract Forms was once a contender in the ancient games. Could the foundations of Western philosophy have been laid by a former wrestling star?",
        "Plato's dialogues aren't just arguments; they're captivating dramas starring Socrates and a cast of brilliant minds. Imagine the philosopher of truth as a master storyteller, weaving philosophical concepts into narratives that still grip readers millennia later.",
        "Imagine being chained in a cave, mistaking shadows for reality. This wasn't just a story for Plato; it was a powerful and unsettling theory about how easily our perceptions can be manipulated and how difficult it is to grasp true knowledge. Even now, it makes you wonder: what shadows are we mistaking for real life?"
      ]
    },
    "Immanuel Kant":{
      image: "https://www.art-prints-on-demand.com/kunst/_becker/Immanuel-Kant.jpg",
      funFacts: [
        "Kant stuck to his daily walking schedule so rigidly that neighbors in Königsberg set their clocks by his routine.",
        "He mapped the universe and laid down universal moral laws, yet Immanuel Kant's entire life unfolded within the confines of his hometown. How did a mind so vast find its entire world within the same familiar streets?",
        "He once wrote an essay titled 'What is Enlightenment?' where he called for people to think for themselves — radical in a time of monarchy.",
        "He took 10 years to write Critique of Pure Reason and then rewrote the whole thing after realizing nobody understood it."
      ]
    },
    "Jean-Paul Sartre":{
      image: "https://cdn.britannica.com/76/9476-050-6661C2E1/photograph-Jean-Paul-Sartre-Gisele-Freund-1968.jpg",
      funFacts: [
        "Sartre once turned down the Nobel Prize in Literature (1964) — he believed writers should not allow themselves to be turned into institutions.",
        "He experimented with mescaline (a psychedelic drug) and became obsessed with crustaceans — he claimed to see lobsters following him for weeks.",
        "Sartre had a lifelong open relationship with Simone de Beauvoir — they had a 'pact' to tell each other everything, including about their other lovers.",
        "He was once arrested during a protest — President Charles de Gaulle personally intervened and said, 'You don’t arrest Voltaire.' ",
      ]
    },
    "Friedrich Nietzsche":{
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSccreLsjJv_83D3MfXIlAB4dmeJzhTdfBfRA&s",
      funFacts: [
        "Nietzsche composed classical music — he once sent some of it to Richard Wagner (his idol), who hated it.",
        "He wrote his famous work Thus Spoke Zarathustra while hiking alone in the Swiss Alps for weeks.",
        "He allegedly went insane after hugging a beaten horse in Italy — a moment known as the “Turin Horse incident.”",
        "Nietzsche was almost completely unknown during his lifetime — he only became famous after his sister edited and distorted his work after his death."
      ]
    },
    "Spinoza": {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtI2w7VgaG42TeT0oI1FtH-ErLn-8OpHMxwg&s",
      funFacts: [
        "He was excommunicated from the Jewish community at age 23 for his radical views — one of the harshest bans ever recorded.",
        "Spinoza was a skilled lens grinder — he earned his living making lenses and may have died from lung issues due to glass dust.",
        "He anticipated Einstein’s view of God — pantheism: that God and nature are one and the same.",
        "He never published under his full name during his lifetime — out of fear of persecution from both church and state."
      ]
    },
    "Sigmund Freud": {
      image: "https://cdn.mos.cms.futurecdn.net/yqHsTte8UCiVowW3Qr7cVB.jpg",
      funFacts: [
        "Freud had a major cocaine habit early in his career and even prescribed it to friends — believing it was a miracle drug.",
        "He had a collection of ancient figurines and artifacts — he used them to decorate his office, like a mini museum.",
        "Freud’s favorite dog was a Chow Chow named Jofi, who sat in during his therapy sessions — he believed dogs calmed patients.",
        "He experienced a nervous breakdown and had recurring dreams about death — which he analyzed himself obsessively."
      ]

    },
    "Arthur Schopenhauer": {
      image: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Arthur_Schopenhauer_by_J_Sch%C3%A4fer%2C_1859b.jpg",
      funFacts: [
        "He hated noise — especially the cracking of whips — and even wrote a philosophical essay titled 'On Noise.'",
        "He once pushed a woman down the stairs for being too loud outside his apartment — and had to pay her for the rest of her life.",
        "Schopenhauer carried a statue of Buddha on his desk — he deeply admired Eastern philosophy and saw parallels with his own pessimism.",
        "Despite his misogyny in writing, he never married and lived with a succession of poodles, one of which he named Atma (Sanskrit for “soul”)."
      ]

    },
    "Hegel": {
      image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Hegel_portrait_by_Schlesinger_1831.jpg",
      funFacts: [
        "Hegel’s lectures were so complex that students often transcribed them word-for-word without understanding — forming the basis for future publications.",
        "He died during a cholera epidemic — though some say it may have been from a different illness entirely.",
        "He was a huge fan of Napoleon, calling him 'the world-soul on horseback.'",
        "Hegel was once roommates with the poet Hölderlin and philosopher Schelling — a trio of brilliance living together in their 20s."
      ]

    }
    // Add more in time 
  };

  const info = quote ? philosopherData[quote.philosopher] : null;
  const randomFact = info ? info.funFacts[Math.floor(Math.random() * info.funFacts.length)] : '';  

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setShowMoodModal(false);
    }
  };
  

  return (
    <div className="app-container">
      <motion.div className="header-bubble" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Get to know the Philosophers through LLMs</h1>
        <p className="caption">Let curiosity guide your thoughts</p>
      </motion.div>

      <motion.div className="action-section" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
        <button className="gradient-button" onClick={getQuote}>✨ Get me a quote</button>
      </motion.div>

      <div className="quote-display">
        <div className="left-panel">
          {error && <p className="error-text">{error}</p>}
          {quote && (
            <motion.div className="quote-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="quote-text">{quote.quote}</p>
              <p className="philosopher-text">– {quote.philosopher}</p>
            </motion.div>
          )}
        </div>
        <div className="right-panel">
          {quote && (
            <button className="who-button" onClick={() => setShowInfo(!showInfo)}>
              🧠 Who said this?
            </button>
          )}

          {showInfo && info && (
            <motion.div className="info-card" initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y:0 }}>
              <img src={info.image} alt={quote.philosopher} className="philosopher-img" />
              <p className="fun-fact">💡 {randomFact}</p>
            </motion.div>
          )}
        </div>

      </div>

      <div className="select-time-container">
        <button className="select-time-button" onClick={() => setShowMoodModal(true)}>
          🕛 Select your time / I'm working on...
        </button>
      </div>
      {showMoodModal && (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <motion.div className="mood-modal" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <button className="close-button" onClick={() => setShowMoodModal(false)}>×</button>
          <h3>What are you going through?</h3>
          <ul className="mood-options">
            <li>💔 Heartbreak</li>
            <li>🔥 Burnout</li>
            <li>😔 Self-doubt</li>
            <li>💭 Existential thoughts</li>
            <li>😮‍💨 Stress & Anxiety</li>
          </ul>
        </motion.div>
      </div>
    )}
    </div>
    
  );
}
export default App;