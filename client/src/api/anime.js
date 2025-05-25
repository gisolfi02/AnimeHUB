import axios from "axios";

const API_URL = "http://localhost:5000/api/anime";

export const getAllAnime = (page = 1, limit = 100) => axios.get(`${API_URL}?page=${page}&limit=${limit}`);
export const createAnime = (data) => axios.post(API_URL, data);
export const deleteAnime = (id) => axios.delete(`${API_URL}/${id}`);
export const updateAnime = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const searchAnimeByName = (query, page = 1, limit = 100) =>  axios.get(`${API_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
export const getAnimeRatings = () => axios.get(`${API_URL}/ratings`);
export const getAnimeGenres = () => axios.get(`${API_URL}/genres`);
export const getAnimeProducers = () => axios.get(`${API_URL}/producers`);
export const getAnimeStudios = () => axios.get(`${API_URL}/studios`);
export const checkAnimeIdExists = async (malId) => {
    const res = await axios.get(`${API_URL}/check-id/${malId}`);
    return res.data.exists;
};