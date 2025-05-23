import axios from "axios";

const API_URL = "http://localhost:5000/api/review";

export const getAllReviews = (page = 1, limit = 100) =>axios.get(`${API_URL}?page=${page}&limit=${limit}`);
export const createReview = (data) => axios.post(API_URL, data);
export const updateReview = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteReview = (id) => axios.delete(`${API_URL}/${id}`);
export const getFullReviewInfo = (page = 1, limit = 10) =>axios.get(`${API_URL}/full?page=${page}&limit=${limit}`);
