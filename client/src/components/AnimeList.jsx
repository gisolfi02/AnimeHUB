import '../assets/css/AnimeList.css';
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
  const [sort, setSort] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState("");
  const [selectedStudio, setSelectedStudio] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const airedRegex = /^([A-Z][a-z]{2} \d{1,2}, \d{4})( to (([A-Z][a-z]{2} \d{1,2}, \d{4})|\?))?$/;

  const fetchPage = (pageNum, limitVal = limit, sortVal = sort) => {
    let sortField = "MAL_ID";
    let sortOrder = 1;
    if (sortVal === "MAL_ID_desc") { sortField = "MAL_ID"; sortOrder = -1; }
    if (sortVal === "Name_asc") { sortField = "Name"; sortOrder = 1; }
    if (sortVal === "Name_desc") { sortField = "Name"; sortOrder = -1; }
    if (sortVal === "Score_asc") { sortField = "Score"; sortOrder = 1; }
    if (sortVal === "Score_desc") { sortField = "Score"; sortOrder = -1; }

    const filters = {
      genres: selectedGenres,
      producer: selectedProducer,
      studio: selectedStudio,
      ratings: selectedRatings
    };

    if (search.trim() === "") {
      getAllAnime(pageNum, limitVal, sortField, sortOrder, filters).then(res => {
        setAnimeList(res.data.data);
        setTotalPages(res.data.totalPages);
        setPage(res.data.currentPage);
      });
    } else {
      searchAnimeByName(search, pageNum, limitVal, sortField, sortOrder, filters).then(res => {
        setAnimeList(res.data.data);
        setTotalPages(res.data.totalPages);
        setPage(res.data.currentPage);
      });
    }
  };

  useEffect(() => {
    fetchPage(page, limit, sort);
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
  }, [limit, page, search, refresh, sort, selectedGenres, selectedProducer, selectedStudio, selectedRatings]);

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

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  // Gestione filtri
  const handleGenreCheckbox = (e) => {
    const value = e.target.value;
    setSelectedGenres(prev =>
      prev.includes(value)
        ? prev.filter(g => g !== value)
        : [...prev, value]
    );
    setPage(1);
  };
  const handleProducerChange = (e) => {
    setSelectedProducer(e.target.value);
    setPage(1);
  };
  const handleStudioChange = (e) => {
    setSelectedStudio(e.target.value);
    setPage(1);
  };
  const handleRatingCheckbox = (e) => {
    const value = e.target.value;
    setSelectedRatings(prev =>
      prev.includes(value)
        ? prev.filter(r => r !== value)
        : [...prev, value]
    );
    setPage(1);
  };

  return (
    <div className='animeListContainer'>
      <h2>Anime List (pagina {page} di {totalPages})</h2>
      <div className='CercaVisualizzaOrdina'>
        <div className='form-group' id='cerca'>
          <label htmlFor="search">Cerca: </label>
          <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Cerca anime per nome..."
        />
        </div>
        
        <div className='form-group'>
          <label htmlFor="limit" >Visualizza per pagina: </label>
          <select id="limit" value={limit} onChange={handleLimitChange}>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
          </select>
        </div>
        

        <div className='form-group'>
          <label htmlFor="sort" >Ordina per: </label>
          <select id="sort" value={sort} onChange={handleSortChange}>
          <option value="MAL_ID_asc">MAL_ID Crescente</option>
          <option value="MAL_ID_desc">MAL_ID Decrescente</option>
          <option value="Name_asc">Nome Crescente</option>
          <option value="Name_desc">Nome Decrescente</option>
          <option value="Score_asc">Score Crescente</option>
          <option value="Score_desc">Score Decrescente</option>
        </select>
        </div>
      </div>

     
      <div className='filtri' style={{ marginBottom: "1rem" }}>
        <div className="generi">
  <label className="generi-label">Generi:</label>
  <div className="generi-container">
    {genresList.map(g => (
      <label key={g}>
        <input
          type="checkbox"
          value={g}
          checked={selectedGenres.includes(g)}
          onChange={handleGenreCheckbox}
        />
        {g}
      </label>
    ))}
  </div>
</div>
        
        <div className='produttoriStudio'>
          
        <div className='form-group'>
        <label>Produttore:</label>
        <select value={selectedProducer} onChange={handleProducerChange}>
          <option value="">Tutti</option>
          {producersList.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        </div>
        
        <div className='form-group'>
          <label >Studio:</label>
        <select value={selectedStudio} onChange={handleStudioChange}>
          <option value="">Tutti</option>
          {studiosList.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        </div>
        </div>


        <div className="valutazione-wrapper">
  <div className='valutazione'>
    <label className='valutazione-label'>Valutazione:</label>
    <div className='valutazione-container'>
      {ratings.map(r => (
        <label key={r}>
          <input
            type="checkbox"
            value={r}
            checked={selectedRatings.includes(r)}
            onChange={handleRatingCheckbox}
          />
          {r}
        </label>
      ))}
    </div>
  </div>
</div>
      </div>

      {error && <div style={{ color: "red", margin: "0.5rem 0" }}>{error}</div>}

      <table>
        <thead className='headTable'>
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
            <th>Ranking</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody className='bodyTable'>
          {animeList.length === 0 ? (
            <tr>
              <td colSpan={11} style={{ textAlign: "center" }}>Nessun Risultato</td>
            </tr>
          ) : (
            animeList.map(anime =>
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
                    <button className='save-btn' onClick={() => handleSave(anime._id)}>Salva</button>
                    <button className='cancel-btn' onClick={handleCancel}>Annulla</button>
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
                    <div className='action-btn'>
                      <button className='edit-btn' onClick={() => handleEdit(anime)}>Modifica</button>
                    <button className= 'delete-btn' onClick={() => handleDelete(anime._id)}>Elimina</button>
                    </div>
                  </td>
                </tr>
              )
            ) 
          )}
        </tbody>
      </table>

      <div className= 'nav-btn'>
        <button className='back-btn' onClick={prevPage} disabled={page === 1}>Indietro</button>
        <button className='go-btn' onClick={nextPage} disabled={page === totalPages}>Avanti </button>
      </div>
    </div>
  );
};

export default AnimeList;
