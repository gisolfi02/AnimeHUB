import { useEffect, useState } from "react";
import { getAllAnime, deleteAnime, updateAnime, searchAnimeByName } from "../api/anime";

const AnimeList = ({ refresh }) => {
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(100);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState("");

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

      <table>
        <thead>
          <tr>
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
                  <input name="Name" value={editForm.Name} onChange={handleInputChange} />
                </td>
                <td>
                  <input name="Score" value={editForm.Score} onChange={handleInputChange} />
                </td>
                <td>
                  <input name="Genres" value={editForm.Genres} onChange={handleInputChange} />
                </td>
                <td>
                  <input name="Episodes" value={editForm.Episodes} onChange={handleInputChange} />
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
                  <input name="Rating" value={editForm.Rating} onChange={handleInputChange} />
                </td>
                <td>
                  <input name="Ranked" value={editForm.Ranked} onChange={handleInputChange} />
                </td>
                <td>
                  <button onClick={() => handleSave(anime._id)}>Salva</button>
                  <button onClick={handleCancel}>Annulla</button>
                </td>
              </tr>
            ) : (
              <tr key={anime._id}>
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
