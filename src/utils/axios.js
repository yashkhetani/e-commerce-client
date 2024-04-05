import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://e-commerce-server-nr8x.onrender.com/",
});

export default customFetch;
