// src/services/api.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true  // sends cookies automatically
});

export default API;