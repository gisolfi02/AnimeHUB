import { useState } from 'react';
import AnimeList from './components/AnimeList';
import AnimeForm from './components/AnimeForm';
import ReviewList from './components/ReviewList';
import ReviewForm from './components/ReviewForm';
import JoinList from "./components/JoinList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh(prev => !prev);

  return (
    <div>
      <h1>Anime Manager</h1>
      <AnimeForm onCreated={triggerRefresh} />
      <AnimeList refresh={refresh} />

      <h1>Review Manager</h1>
      <ReviewForm onCreated={triggerRefresh} />
      <ReviewList key={refresh} />
      <JoinList />
    </div>
  );
}

export default App;
