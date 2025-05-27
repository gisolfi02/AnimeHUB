import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnimeList from './components/AnimeList';
import AnimeForm from './components/AnimeForm';
import ReviewList from './components/ReviewList';
import ReviewForm from './components/ReviewForm';
import JoinList from "./components/JoinList";
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh(prev => !prev);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/anime-form" element={<AnimeForm onCreated={triggerRefresh} />} />
        <Route path="/anime-list" element={<AnimeList refresh={refresh} />} />
        <Route path="/review-form" element={<ReviewForm onCreated={triggerRefresh} />} />
        <Route path="/review-list" element={<ReviewList key={refresh} />} />
        <Route path="/join-list" element={<JoinList />} />
  
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
