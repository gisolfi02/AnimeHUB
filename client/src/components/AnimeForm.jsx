import { useState } from "react";
import { createAnime } from "../api/anime";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
      <input name="MAL_ID" type="number" value={form.MAL_ID} onChange={handleChange} placeholder="MAL ID" required />
      <input name="Name" value={form.Name} onChange={handleChange} placeholder="Nome Anime" required />
      <input name="Score" type="number" step="0.01" value={form.Score} onChange={handleChange} placeholder="Score" required />
      <input name="Genres" value={form.Genres} onChange={handleChange} placeholder="Generi (es: Action, Drama)" />
      <input name="Episodes" type="number" value={form.Episodes} onChange={handleChange} placeholder="Numero Episodi" />
      <input name="Aired" value={form.Aired} onChange={handleChange} placeholder="Periodo (es: Apr 3, 1998 to Apr 24, 1999)" />
      <input name="Producers" value={form.Producers} onChange={handleChange} placeholder="Produttori" />
      <input name="Studios" value={form.Studios} onChange={handleChange} placeholder="Studios" />
      <input name="Rating" value={form.Rating} onChange={handleChange} placeholder="Rating (es: R - 17+)" />
      <input name="Ranked" type="number" step="0.01" value={form.Ranked} onChange={handleChange} placeholder="Posizione nel ranking" />

      <button type="submit">Aggiungi Anime</button>
    </form>
  );
};

export default AnimeForm;
