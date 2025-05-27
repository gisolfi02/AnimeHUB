import '../assets/AnimeList.css';
import { useState, useEffect } from "react";
import { createAnime, getAnimeRatings, checkAnimeIdExists, getAnimeGenres, getAnimeProducers, getAnimeStudios } from "../api/anime";

const AnimeForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    MAL_ID: "",
    Name: "",
    Score: "",
    Genres: "",
    Episodes: "",
    Aired: "",
    Producers: "",
    Studios: "",
    Rating: "",
    Ranked: ""
  });
  const [ratings, setRatings] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [producersList, setProducersList] = useState([]);
  const [studiosList, setStudiosList] = useState([]);
  const [error, setError] = useState("");

  const airedRegex = /^([A-Z][a-z]{2} \d{1,2}, \d{4})( to (([A-Z][a-z]{2} \d{1,2}, \d{4})|\?))?$/;

  useEffect(() => {
    getAnimeRatings().then((res) => {
      setRatings(res.data);
    });
    getAnimeGenres().then((res) => {
      setGenresList(res.data.map(g => g.toLowerCase()));
    });
    getAnimeProducers().then((res) => {
      setProducersList(res.data.map(p => p.toLowerCase()));
    });
    getAnimeStudios().then((res) => {
      setStudiosList(res.data.map(s => s.toLowerCase()));
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Controllo MAL_ID
    const exists = await checkAnimeIdExists(form.MAL_ID);
    if (exists) {
      setError("MAL_ID già presente. Inserisci un ID diverso.");
      return;
    }

    // Controllo Score
    if(form.Score < 0 || form.Score > 10) {
      setError("Score non valido");
      return;
    }

    // Controllo Episodi
    if(form.Episodes < 0) {
      setError("Numero di episodi non valido");
      return;
    }

    // Controllo Rating
    if(form.Ranked < 0) {
      setError("Posizione nel ranking non valida");
      return;
    }

    // Contorllo Rilascio
    if (!airedRegex.test(form.Aired.trim())) {
      setError('Data di rilascio non valida');
      return;
    }

    // Controllo generi
    if (form.Genres) {
      const inputGenres = form.Genres.split(",").map(g => g.trim().toLowerCase()).filter(Boolean);
      const invalidGenres = inputGenres.filter(g => !genresList.includes(g));
      if (invalidGenres.length > 0) {
        setError(`Genere/i non valido/i: ${invalidGenres.join(", ")}`);
        return;
      }
    }

    // Controllo produttori
    if (form.Producers) {
      const inputProducers = form.Producers.split(",").map(p => p.trim().toLowerCase()).filter(Boolean);
      const invalidProducers = inputProducers.filter(p => !producersList.includes(p));
      if (invalidProducers.length > 0) {
        setError(`Produttore/i non valido/i: ${invalidProducers.join(", ")}`);
        return;
      }
    }

    // Controllo studios
    if (form.Studios) {
      const inputStudios = form.Studios.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      const invalidStudios = inputStudios.filter(s => !studiosList.includes(s));
      if (invalidStudios.length > 0) {
        setError(`Studio/i non valido/i: ${invalidStudios.join(", ")}`);
        return;
      }
    }

    const formattedForm = {
      ...form,
      MAL_ID: parseInt(form.MAL_ID),
      Score: parseFloat(form.Score),
      Episodes: parseInt(form.Episodes),
      Ranked: parseFloat(form.Ranked)
    };

    await createAnime(formattedForm);
    onCreated();

    setForm({
      MAL_ID: "",
      Name: "",
      Score: "",
      Genres: "",
      Episodes: "",
      Aired: "",
      Producers: "",
      Studios: "",
      Rating: "",
      Ranked: ""
    });
  };

  return (
    <div className='animeFormContainer'>
    <form onSubmit={handleSubmit}>
      <div className='splitContainer'>
        <div className='leftContainer'>
          <input name="MAL_ID" type="number" value={form.MAL_ID} onChange={handleChange} placeholder="MAL ID" required />
          <input name="Name" value={form.Name} onChange={handleChange} placeholder="Nome Anime" required />
          <input name="Score" type="number" step="0.01" value={form.Score} onChange={handleChange} placeholder="Score" required />
          <input name="Genres" value={form.Genres} onChange={handleChange} placeholder="Generi (es: Action, Drama)" />
          <input name="Episodes" type="number" value={form.Episodes} onChange={handleChange} placeholder="Numero Episodi" />
        </div>
        <div className='rightContainer'>
          <input name="Aired" value={form.Aired} onChange={handleChange} placeholder="Periodo (es: Apr 3, 1998 to Apr 24, 1999)" />
          <input name="Producers" value={form.Producers} onChange={handleChange} placeholder="Produttori" />
          <input name="Studios" value={form.Studios} onChange={handleChange} placeholder="Studios" />
          <select name="Rating" value={form.Rating} onChange={handleChange} required>
            <option value="">Seleziona Rating</option>
            {ratings.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <input name="Ranked" type="number" step="0.01" value={form.Ranked} onChange={handleChange} placeholder="Posizione nel ranking" />
          {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
      </div>
    </form>
    <button type="submit">Aggiungi Anime</button>
    </div>
  );
};

export default AnimeForm;
