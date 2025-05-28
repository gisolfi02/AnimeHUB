import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnimeList from './components/AnimeList';
import AnimeForm from './components/AnimeForm';
import ReviewList from './components/ReviewList';
import ReviewForm from './components/ReviewForm';
import JoinList from "./components/JoinList";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './assets/css/App.css';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const triggerRefresh = () => setRefresh(prev => !prev);

  const getButtonClass = (path) => activeButton === path ? "active" : "";

  // Determina se mostrare lo sfondo e la descrizione
  const showBackground = activeButton === null;

  // Applica la classe per nascondere lo sfondo se necessario
  const rootClass = showBackground ? "" : "no-background";

  return (
    <Router>
      <div id="root" className={rootClass}>
        <Navbar onLogoClick={() => setActiveButton(null)} />
        <main className={rootClass}>
          {showBackground && (


            <div class="hero-description">
            
              <h2 class="intro-headline">Ami gli anime?</h2>
              <p class="intro-description">
                Su <strong>AnimeHUB</strong> puoi aggiungere nuovi titoli, leggere le recensioni degli altri utenti e scoprire cosa guardare, tutto in un solo posto.<br></br>
                Crea la tua lista, condividi opinioni e vivi la passione per l’animazione giapponese insieme alla community.
              </p>
              <h3 class="intro-description">
                Sei pronto? Noi sì! Divertiti!
              </h3>
            </div>

          
          )}
          <div className='buttonContainer'>
            <Link to="/anime-form">
              <button className={getButtonClass("/anime-form")} onClick={() => setActiveButton("/anime-form")}>Aggiungi Anime</button>
            </Link>
            <Link to="/anime-list">
              <button className={getButtonClass("/anime-list")} onClick={() => setActiveButton("/anime-list")}>Visualizza Anime</button>
            </Link>
            <Link to="/review-form">
              <button className={getButtonClass("/review-form")} onClick={() => setActiveButton("/review-form")}>Aggiungi Review</button>
            </Link>
            <Link to="/review-list">
              <button className={getButtonClass("/review-list")} onClick={() => setActiveButton("/review-list")}>Visualizza Review</button>
            </Link>
            <Link to="/join-list">
              <button  className={getButtonClass("/join-list")} onClick={() => setActiveButton("/join-list")}>Visualizza Tutto</button>
            </Link>
          </div>
          {/* Mostra le route solo se è stato selezionato un bottone */}
          {activeButton && (
            <Routes>
              <Route path="/anime-form" element={<AnimeForm onCreated={triggerRefresh} />} />
              <Route path="/anime-list" element={<AnimeList refresh={refresh} />} />
              <Route path="/review-form" element={<ReviewForm onCreated={triggerRefresh} />} />
              <Route path="/review-list" element={<ReviewList key={refresh} />} />
              <Route path="/join-list" element={<JoinList />} />
            </Routes>
          )}
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
