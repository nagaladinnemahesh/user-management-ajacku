import axios from "axios";

// axios instance for api requests
const API = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",  // mock api, base url for all requests
});

export default API;
