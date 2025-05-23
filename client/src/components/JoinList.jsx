import { useEffect, useState } from "react";
import { getFullReviewInfo } from "../api/review";

const FullReviewList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getFullReviewInfo(page, limit).then((res) => {
      console.log("Dati ricevuti dal server:", res.data);
      setData(res.data.data);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    });
  }, [page, limit]);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div>
      <h2>Review + Anime + Status</h2>

      <label>
        Visualizza per pagina::
        <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
      </label>

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
