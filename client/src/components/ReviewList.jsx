import { useEffect, useState } from "react";
import { getAllReviews, deleteReview, updateReview, searchReviewByAnimeID } from "../api/review";

const ReviewList = () => {
    const [reviewList, setReviewList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [totalPages, setTotalPages] = useState(1);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [search, setSearch] = useState("");

    const fetchPage = (pageNum, limitVal = limit) => {
        if (search.trim() === "") {
            getAllReviews(pageNum, limitVal).then(res => {
                setReviewList(res.data.data);
                setPage(res.data.currentPage);
                setTotalPages(res.data.totalPages);
            });
        }else{
            searchReviewByAnimeID(search, pageNum, limitVal).then(res => {
                setReviewList(res.data.data);
                setPage(res.data.currentPage);
                setTotalPages(res.data.totalPages);
            });
        }
    };

    useEffect(() => {
        fetchPage(page, limit);
    }, [limit, page, search]);

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

    const handleDelete = async (id) => {
        await deleteReview(id);
        fetchPage(page, limit);
    };

    const handleEdit = (review) => {
        setEditingId(review._id);
        setEditForm({ ...review });
    };

    const handleInputChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async (id) => {
        await updateReview(id, {
            ...editForm,
            user_id: Number(editForm.user_id),
            anime_id: Number(editForm.anime_id),
            rating: Number(editForm.rating),
            watching_status: Number(editForm.watching_status),
            watched_episodes: Number(editForm.watched_episodes)
        });
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
            <h2>Review List (pagina {page} di {totalPages})</h2>

            <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Cerca review per anime_id..."
                style={{ marginBottom: "1rem", padding: "0.5rem" }}
            />

            <label htmlFor="limit" style={{ marginLeft: "1rem" }}>Visualizza per pagina: </label>
            <select id="review-limit" value={limit} onChange={handleLimitChange}>
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
            </select>

            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Anime ID</th>
                        <th>Rating</th>
                        <th>Watching Status</th>
                        <th>Watched Episodes</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {reviewList.map(review => editingId === review._id ? (
                        <tr key={review._id}>
                            <td><input name="user_id" value={editForm.user_id} onChange={handleInputChange} /></td>
                            <td><input name="anime_id" value={editForm.anime_id} onChange={handleInputChange} /></td>
                            <td><select name="rating" value={editForm.rating} onChange={handleInputChange}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                            </select>
                            </td>
                            <td><select name="watching_status" value={editForm.watching_status} onChange={handleInputChange}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </select>
                            </td>
                            <td><input name="watched_episodes" value={editForm.watched_episodes} onChange={handleInputChange} /></td>
                            <td>
                                <button onClick={() => handleSave(review._id)}>Salva</button>
                                <button onClick={handleCancel}>Annulla</button>
                            </td>
                        </tr>
                    ) : (
                        <tr key={review._id}>
                            <td>{review.user_id}</td>
                            <td>{review.anime_id}</td>
                            <td>{review.rating}</td>
                            <td>{review.watching_status}</td>
                            <td>{review.watched_episodes}</td>
                            <td>
                                <button onClick={() => handleEdit(review)}>Modifica</button>
                                <button onClick={() => handleDelete(review._id)}>Elimina</button>
                            </td>
                        </tr>
                    )
                    )}
                </tbody>
            </table>

            <div style={{ marginTop: "10px" }}>
                <button onClick={prevPage} disabled={page === 1}>Indietro</button>
                <button onClick={nextPage} disabled={page === totalPages}>Avanti</button>
            </div>
        </div>
    );
};

export default ReviewList;
