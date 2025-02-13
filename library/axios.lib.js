require('dotenv').config();
const ACCESS_KEY = process.env.API_KEY
const axios = require('axios');
const axiosInstance = axios.create({
    headers:{
        Authorization: `API-KEY ${ACCESS_KEY}`
    }
});

module.exports = axiosInstance;