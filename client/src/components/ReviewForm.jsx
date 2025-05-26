import { useState } from "react";
import { createReview, checkReviewByAnimeAndUserID } from "../api/review";
import { checkAnimeIdExists } from "../api/anime";

const ReviewForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    user_id: "",
    anime_id: "",
    rating: "",
    watching_status: "",
    watched_episodes: ""
  });
  const [error, setError] = useState("");


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    // Controllo user ID
    if (form.user_id < 0 || form.user_id == "") {
      setError("User ID non valido");
      return;
    }

    // Controllo Anime ID
    const exists = await checkAnimeIdExists(form.anime_id);
    if (!exists) { 
      setError("Anime ID non valido. Inserisci un ID esistente.");
      return;
    }

    // Controllo Watching Episodes
    if (form.watched_episodes < 0 || form.watched_episodes == "") {
      setError("Watched Episodes non valido");
      return;
    }

    // Controllo user ID e Anime ID 
    const reviewExists = await checkReviewByAnimeAndUserID(form.anime_id, form.user_id);
    if (reviewExists) {
      setError("Review già esistente per questo Anime e User ID.");
      return;
    }



    await createReview({
      ...form,
      user_id: Number(form.user_id),
      anime_id: Number(form.anime_id),
      rating: Number(form.rating),
      watching_status: Number(form.watching_status),
      watched_episodes: Number(form.watched_episodes)
    });
    onCreated();
    setForm({
      user_id: "",
      anime_id: "",
      rating: "",
      watching_status: "",
      watched_episodes: ""
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="user_id" type="number" value={form.user_id} onChange={handleChange} placeholder="User ID" required/>
      <input name="anime_id" type="number" value={form.anime_id} onChange={handleChange} placeholder="Anime ID" required/>
      <select name="rating" value={form.rating} onChange={handleChange} placeholder="Rating" required>
        <option value="" disabled></option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
      <select name="watching_status" value={form.watching_status} onChange={handleChange} placeholder="Status" required>
        <option value="" disabled></option>
        <option value="1">In Corso</option>
        <option value="2">Completato</option>
        <option value="3">In Pausa</option>
        <option value="4">Abbandonato</option>
        <option value="5">Da Iniziare</option>
      </select>
      <input name="watched_episodes" type="number" value={form.watched_episodes} onChange={handleChange} placeholder="Watched Ep." required/>
      <button type="submit">Aggiungi Review</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
    
  );
};

export default ReviewForm;
