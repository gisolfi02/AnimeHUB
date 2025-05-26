import { useEffect, useState } from "react";
import { getAllAnime, deleteAnime, updateAnime, searchAnimeByName, getAnimeRatings, getAnimeGenres, getAnimeProducers, getAnimeStudios, checkAnimeRatingExists } from "../api/anime";

const AnimeList = ({ refresh }) => {
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(100);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState("");
  const [ratings, setRatings] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [producersList, setProducersList] = useState([]);
  const [studiosList, setStudiosList] = useState([]);
  const [error, setError] = useState("");
  const airedRegex = /^([A-Z][a-z]{2} \d{1,2}, \d{4})( to (([A-Z][a-z]{2} \d{1,2}, \d{4})|\?))?$/;

  const fetchPage = (pageNum, limitVal = limit) => {
    if (search.trim() === "") {
      getAllAnime(pageNum, limitVal).then(res => {
        setAnimeList(res.data.data);
        setTotalPages(res.data.totalPages);
        setPage(res.data.currentPage);
      });
    } else {
      searchAnimeByName(search, pageNum, limitVal).then(res => {
        setAnimeList(res.data.data);
        setTotalPages(res.data.totalPages);
        setPage(res.data.currentPage);
      });
    }
  };

  useEffect(() => {
    fetchPage(page, limit);
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
  }, [limit, page, search, refresh]);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handleDelete = async (id) => {
    await deleteAnime(id);
    fetchPage(page, limit);
  };

  const handleEdit = (anime) => {
    setEditingId(anime._id);
    setEditForm({ ...anime });
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    setError("");

    // Controllo Name
    if (!editForm.Name || editForm.Name.trim() === "") {
      setError("Nome non valido");
      return;
    }

    // Controllo Score
    if(editForm.Score < 0 || editForm.Score > 10 || editForm.Score == "") {
      setError("Score non valido");
      return;
    }

    // Controllo Generi
    if (editForm.Genres && editForm.Genres.trim() !== "") {
      const inputGenres = editForm.Genres.split(",").map(g => g.trim().toLowerCase()).filter(Boolean);
      const invalidGenres = inputGenres.filter(g => !genresList.includes(g));
      if (invalidGenres.length > 0) {
        setError(`Genere/i non valido/i: ${invalidGenres.join(", ")}`);
        return;
      }
    }else {
      setError("Generi non validi");
      return;
    }

    // Controllo Episodi
    if(editForm.Episodes < 0 || editForm.Episodes =="") {
      setError("Numero di episodi non valido");
      return;
    }

    // Controllo Data rilascio
    if (!airedRegex.test((editForm.Aired || "").trim())) {
      setError('Data di rilascio non valida');
      return;
    }

    // Controllo Produttori
    if (editForm.Producers && editForm.Producers.trim() !== "") {
      const inputProducers = editForm.Producers.split(",").map(p => p.trim().toLowerCase()).filter(Boolean);
      const invalidProducers = inputProducers.filter(p => !producersList.includes(p));
      if (invalidProducers.length > 0) {
        setError(`Produttore/i non valido/i: ${invalidProducers.join(", ")}`);
        return;
      }
    }else {
      setError("Produttori non validi");
      return;
    }
    
    // Controllo Studi
    if (editForm.Studios && editForm.Studios.trim() !== "") {
      const inputStudios = editForm.Studios.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      const invalidStudios = inputStudios.filter(s => !studiosList.includes(s));
      if (invalidStudios.length > 0) {
        setError(`Studio/i non valido/i: ${invalidStudios.join(", ")}`);
        return;
      }
    }else {
      setError("Studios non validi");
      return;
    }

    // Controllo Ranking
    if(editForm.Ranked < 0 || editForm.Ranked=="") {
      setError("Posizione nel ranking non valida");
      return;
    }else {
      const ratingExists = await checkAnimeRatingExists(editForm.Rating);
      if (!ratingExists) {
        setError("Posizione nel ranking già presente")
        return;
      }
    }

    await updateAnime(id, editForm);
    setEditingId(null);
    fetchPage(page, limit);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <h2>Anime List (pagina {page} di {totalPages})</h2>

      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Cerca anime per nome..."
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      />

      <label htmlFor="limit" style={{ marginLeft: "1rem" }}>Visualizza per pagina: </label>
      <select id="limit" value={limit} onChange={handleLimitChange}>
        <option value={10}>10</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={200}>200</option>
      </select>

      {error && <div style={{ color: "red", margin: "0.5rem 0" }}>{error}</div>}

      <table>
        <thead>
          <tr>
            <th>MAL_ID</th>
            <th>Nome</th>
            <th>Score</th>
            <th>Genere</th>
            <th>Episodi</th>
            <th>Rilascio</th>
            <th>Produttori</th>
            <th>Studio</th>
            <th>Valutazione</th>
            <th>Posizione</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {animeList.map(anime =>
            editingId === anime._id ? (
              <tr key={anime._id}>
                <td>
                  <input name="MAL_ID" value={editForm.MAL_ID} onChange={handleInputChange} disabled />
                </td>
                <td>
                  <input name="Name" value={editForm.Name} onChange={handleInputChange} />
                </td>
                <td>
                  <input name="Score" type="number" value={editForm.Score} onChange={handleInputChange} />
                </td>
                <td>
                  <input name="Genres" value={editForm.Genres} onChange={handleInputChange} />
                </td>
                <td>
                  <input name="Episodes" type="number" value={editForm.Episodes} onChange={handleInputChange} />
                </td>
                <td>
                  <input name="Aired" value={editForm.Aired} onChange={handleInputChange} />
                </td>
                <td>
                  <input name="Producers" value={editForm.Producers} onChange={handleInputChange} />
                </td>
                <td>
                  <input name="Studios" value={editForm.Studios} onChange={handleInputChange} />
                </td>
                <td>
                  <select name="Rating" value={editForm.Rating} onChange={handleInputChange} required>
                    <option value="">Seleziona Rating</option>
                    {ratings.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input name="Ranked" type="number" value={editForm.Ranked} onChange={handleInputChange} />
                </td>
                <td>
                  <button onClick={() => handleSave(anime._id)}>Salva</button>
                  <button onClick={handleCancel}>Annulla</button>
                </td>
              </tr>
            ) : (
              <tr key={anime._id}>
                <td>{anime.MAL_ID}</td>
                <td>{anime.Name}</td>
                <td>{anime.Score}</td>
                <td>{anime.Genres}</td>
                <td>{anime.Episodes}</td>
                <td>{anime.Aired}</td>
                <td>{anime.Producers}</td>
                <td>{anime.Studios}</td>
                <td>{anime.Rating}</td>
                <td>{anime.Ranked}</td>
                <td>
                  <button onClick={() => handleEdit(anime)}>Modifica</button>
                  <button onClick={() => handleDelete(anime._id)}>Elimina</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <button onClick={prevPage} disabled={page === 1}>Indietro</button>
        <button onClick={nextPage} disabled={page === totalPages}>Avanti </button>
      </div>
    </div>
  );
};

export default AnimeList;
