import { useEffect, useState } from "react";
import { getFullReviewInfo } from "../api/review";

const FullReviewList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");

  const fetchPage = (pageNum, limitVal = limit, sortVal = sort) => {
    let sortField = "anime_id";
    let sortOrder = 1;

    if (sortVal === "anime_id_asc") { sortField = "anime_id"; sortOrder = 1; }
    if (sortVal === "anime_id_desc") { sortField = "anime_id"; sortOrder = -1; }
    if (sortVal === "rating_asc") { sortField = "rating"; sortOrder = 1; }
    if (sortVal === "rating_desc") { sortField = "rating"; sortOrder = -1; }

    getFullReviewInfo(pageNum, limitVal, sortField, sortOrder).then((res) => {
        console.log("Dati ricevuti dal server:", res.data);
        setData(res.data.data);
        setPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      });
  }

  useEffect(() => {
    fetchPage(page, limit, sort);
  }, [page, limit, sort]);

  const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setPage(1);
    };

  const nextPage = () => {
    if (page < totalPages) fetchPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) fetchPage(page - 1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
    };

  return (
    <div>
      <h2>Review + Anime + Status</h2>

      <label htmlFor="limit" style={{ marginLeft: "1rem" }}>Visualizza per pagina: </label>
      <select id="review-limit" value={limit} onChange={handleLimitChange}>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
      </select>

      <label htmlFor="sort" style={{ marginLeft: "1rem" }}>Ordina per: </label>
      <select id="sort" value={sort} onChange={handleSortChange}>
          <option value="anime_id_asc">Anime ID Crescente</option>
          <option value="anime_id_desc">Anime ID Decrescente</option>
          <option value="rating_asc">Rating Crescente</option>
          <option value="rating_desc">Rating Decrescente</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Anime ID</th>
            <th>Rating</th>
            <th>Nome Anime</th>
            <th>Genere</th>
            <th>Episodi</th>
            <th>Studio</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.user_id}</td>
              <td>{item.anime_id}</td>
              <td>{item.rating}</td>
              <td>{item.anime_name || "-"}</td>
              <td>{item.genres || "-"}</td>
              <td>{item.episodes || "-"}</td>
              <td>{item.studios || "-"}</td>
              <td>{item.status_description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={prevPage} disabled={page === 1}>Indietro</button>
        <span style={{ margin: "0 1rem" }}>Pagina {page} di {totalPages}</span>
        <button onClick={nextPage} disabled={page === totalPages}>Avanti</button>
      </div>
    </div>
  );
};

export default FullReviewList;
