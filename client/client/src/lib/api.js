import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Auth APIs
export const registerUser = (data) => axios.post(`${API_BASE_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_BASE_URL}/auth/login`, data);
export const getUserData = (token) =>
  axios.get(`${API_BASE_URL}/auth/user`, {
    headers: { "x-auth-token": token },
  });

// Post APIs
export const getPosts = (query = "") => axios.get(`${API_BASE_URL}/posts${query}`);
export const getPostById = (id) => axios.get(`${API_BASE_URL}/posts/${id}`);
export const createPost = (data, token) =>
  axios.post(`${API_BASE_URL}/posts`, data, {
    headers: { "x-auth-token": token },
  });
export const updatePost = (id, data, token) =>
  axios.put(`${API_BASE_URL}/posts/${id}`, data, {
    headers: { "x-auth-token": token },
  });
export const deletePost = (id, token) =>
  axios.delete(`${API_BASE_URL}/posts/${id}`, {
    headers: { "x-auth-token": token },
  });

// Analytics API
// export const getAnalytics = (token) =>
//   axios.get(`${API_BASE_URL}/analytics/posts`, {
//     headers: { "x-auth-token": token },
//   });

export const getAnalytics = async (token) => {
    const res = await axios.get(`${API_BASE_URL}/analytics/posts`, {
        headers: { "x-auth-token": token },    });
    return res.data; 
  };
