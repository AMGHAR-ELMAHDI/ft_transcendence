import axios from "axios";

const api = axios.create({
  // baseURL: "https://localhost:2500/",
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
