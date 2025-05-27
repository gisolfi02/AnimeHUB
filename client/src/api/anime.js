import axios from "axios";

const API_URL = "http://localhost:5000/api/anime";

function buildFilterQuery(filters = {}) {
    let query = "";
    if (filters.genres && filters.genres.length > 0)
        filters.genres.forEach(g => { query += `&genres[]=${encodeURIComponent(g)}`; });
    if (filters.producer) query += `&producer=${encodeURIComponent(filters.producer)}`;
    if (filters.studio) query += `&studio=${encodeURIComponent(filters.studio)}`;
    if (filters.ratings && filters.ratings.length > 0)
        filters.ratings.forEach(r => { query += `&ratings[]=${encodeURIComponent(r)}`; });
    return query;
}

export const getAllAnime = (page = 1, limit = 100, sortField="", sortOrder=1, filters={}) => axios.get(`${API_URL}?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}${buildFilterQuery(filters)}`);
export const createAnime = (data) => axios.post(API_URL, data);
export const deleteAnime = (id) => axios.delete(`${API_URL}/${id}`);
export const updateAnime = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const searchAnimeByName = (query, page = 1, limit = 100, sortField="", sortOrder=1, filters={}) => axios.get(`${API_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}${buildFilterQuery(filters)}`);
export const getAnimeRatings = () => axios.get(`${API_URL}/ratings`);
export const getAnimeGenres = () => axios.get(`${API_URL}/genres`);
export const getAnimeProducers = () => axios.get(`${API_URL}/producers`);
export const getAnimeStudios = () => axios.get(`${API_URL}/studios`);
export const checkAnimeIdExists = async (malId) => {
    const res = await axios.get(`${API_URL}/check-id/${malId}`);
    return res.data.exists;
};
export const checkAnimeRatingExists = async (rating) => {
    const res = await axios.get(`${API_URL}/ratings/${rating}`);
    return res.data.exists;
}