import { useState } from "react";
import { createReview } from "../api/review";

const ReviewForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    user_id: "",
    anime_id: "",
    rating: "",
    watching_status: "",
    watched_episodes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <input name="user_id" value={form.user_id} onChange={handleChange} placeholder="User ID" />
      <input name="anime_id" value={form.anime_id} onChange={handleChange} placeholder="Anime ID" />
      <input name="rating" value={form.rating} onChange={handleChange} placeholder="Rating" />
      <input name="watching_status" value={form.watching_status} onChange={handleChange} placeholder="Status" />
      <input name="watched_episodes" value={form.watched_episodes} onChange={handleChange} placeholder="Watched Ep." />
      <button type="submit">Aggiungi Review</button>
    </form>
  );
};

export default ReviewForm;
