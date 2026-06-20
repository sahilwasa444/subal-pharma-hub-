import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL:
    "https://subal-pharmahubat12.onrender.com/api"
});
export default api;
