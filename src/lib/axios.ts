import axios from "axios";

export const AXIOS = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
