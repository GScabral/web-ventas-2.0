import axios from "axios";

const baseURL =
    import.meta.env.MODE === "development"
        ? "https://web-ventas-2-0.onrender.com"
        : "http://localhost:3005";
const API = axios.create({
    baseURL,
    withCredentials: true,
});

export default API;
