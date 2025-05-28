import { useEffect, useState } from "react";
import { getAllReviews, deleteReview, updateReview, searchReviewByAnimeID } from "../api/review";
import "../assets/css/ReviewList.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass, faSort, faArrowRight, faArrowLeft, faFloppyDisk, faXmark, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
library.add(faMagnifyingGlass, faEye,faSort, faArrowRight, faArrowLeft, faFloppyDisk, faXmark, faPen, faTrash);


const ReviewList = () => {
    const [reviewList, setReviewList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [totalPages, setTotalPages] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [sort, setSort] = useState("");
    

    const fetchPage = (pageNum, limitVal = limit, sortVal = sort) => {
        let sortField = "anime_id";
        let sortOrder = 1;
        
    
        if (sortVal === "anime_id_asc") { sortField = "anime_id"; sortOrder = 1; }
        if (sortVal === "anime_id_desc") { sortField = "anime_id"; sortOrder = -1; }
        if (sortVal === "rating_asc") { sortField = "rating"; sortOrder = 1; }
        if (sortVal === "rating_desc") { sortField = "rating"; sortOrder = -1; }

        if (search.trim() === "") {
            getAllReviews(pageNum, limitVal, sortField, sortOrder).then(res => {
                setReviewList(res.data.data);
                setPage(res.data.currentPage);
                setTotalPages(res.data.totalPages);
            });
        }else{
            searchReviewByAnimeID(search, pageNum, limitVal, sortField, sortOrder).then(res => {
                setReviewList(res.data.data);
                setPage(res.data.currentPage);
                setTotalPages(res.data.totalPages);
            });
        }
    };

    useEffect(() => {
        fetchPage(page, limit, sort);
    }, [limit, page, search, sort]);

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
        setError("");

        //Controllo Watching Episodes
        if (editForm.watched_episodes < 0 || editForm.watched_episodes == "") {
            setError("Watched Episodes non valido");
            return;
        }

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
        setError("");
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

    return (
        <div className="reviewListContainer">
            <h2>Review List (pagina {page} di {totalPages})</h2>
            <div className="cercaVisualizzaOrdina">
                <div className='form-group' id='cerca'>
                    <label htmlFor="search"><FontAwesomeIcon icon={["fas", "magnifying-glass"]} size="lg" style={{color: "#4f7241", marginRight:"7px"}} />Cerca: </label>
                    <input
                    type="number"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Cerca review per anime id..."
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor="limit" ><FontAwesomeIcon icon={["far", "eye"]} size="lg" style={{color: "#4f7241",marginRight:"7px"}} />Visualizza per pagina: </label>
                    <select id="limit" value={limit} onChange={handleLimitChange}>
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor="sort" style={{ marginLeft: "1rem" }}><FontAwesomeIcon icon={["fas", "sort"]} style={{color: "#4f7241",marginRight:"7px"}} />Ordina per: </label>
                    <select id="sort" value={sort} onChange={handleSortChange}>
                        <option value="anime_id_asc">Anime ID Crescente</option>
                        <option value="anime_id_desc">Anime ID Decrescente</option>
                        <option value="rating_asc">Rating Crescente</option>
                        <option value="rating_desc">Rating Decrescente</option>
                    </select>
                </div>
            </div>

            {error && <div className="errorContainer"><p>{error}</p></div>}

            <table>
                <thead className="headTable">
                    <tr>
                        <th>User ID</th>
                        <th>Anime ID</th>
                        <th>Rating</th>
                        <th>Watching Status</th>
                        <th>Watched Episodes</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody className="bodyTable">
                    {reviewList.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center" }}><div className="noResult">
                <FontAwesomeIcon icon={["fas","ban"]} size="5x" style={{color: "#4f7241"}} />
                <h3 id="noResult">Nessun Risultato</h3></div></td>
                        </tr>
                    ) : (
                        reviewList.map(review => editingId === review._id ? (
                            <tr key={review._id}>
                                <td><input name="user_id" value={editForm.user_id} onChange={handleInputChange} disabled/></td>
                                <td><input name="anime_id" value={editForm.anime_id} onChange={handleInputChange} disabled/></td>
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
                                <td><input name="watched_episodes" type="number" value={editForm.watched_episodes} onChange={handleInputChange} /></td>
                                <td>
                                    <div className="action-btn">
                                        <button className = "save-btn" onClick={() => handleSave(review._id)}><FontAwesomeIcon icon={["fas", "floppy-disk"]} size="lg" style={{color: "#ffffff",marginRight:"7px"}} />Salva</button>
                                        <button className="cancel-btn" onClick={handleCancel}><FontAwesomeIcon icon={["fas", "xmark"]} size="lg" style={{color: "#ffffff",marginRight:"7px"}} />Annulla</button>
                                    </div>
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
                                    <div className="action-btn">
                                        <button className="edit-btn" ca onClick={() => handleEdit(review)}><FontAwesomeIcon icon={["fas", "pen"]} style={{color: "#ffffff",marginRight:"7px"}} />Modifica</button>
                                        <button className="delete-btn"onClick={() => handleDelete(review._id)}><FontAwesomeIcon icon={["fas","trash"]} style={{color: "#ffffff",marginRight:"7px"}} />Elimina</button>
                                    </div>
                                </td>
                            </tr>
                        )
                        )
                    )}
                </tbody>
            </table>

            <div className="nav-btn">
                <button className="back-btn"onClick={prevPage} disabled={page === 1}><FontAwesomeIcon icon={["fas", "arrow-left"]} size='lg' style={{color: "#ffffff",marginRight:"7px"}} />Indietro</button>
                <button className="go-btn"onClick={nextPage} disabled={page === totalPages}>Avanti <FontAwesomeIcon icon={["fas", "arrow-right"]} size='lg' style={{color: "#ffffff",marginLeft:"7px"}} /></button>
            </div>
        </div>
    );
};

export default ReviewList;
