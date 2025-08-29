import axios from "axios";

// Create an Axios instance with your backend URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // make sure your backend server is running on port 5000
});

export default api;
