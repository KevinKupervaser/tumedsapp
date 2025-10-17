import axios from "axios";

const API_URL = "https://68e54af621dd31f22cc14da5.mockapi.io/api/v1";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
