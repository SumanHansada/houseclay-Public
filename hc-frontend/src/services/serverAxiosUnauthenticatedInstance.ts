import axios from "axios";

import { BASE_API_URL } from "@/common/constants";

// Create an unauthenticated axios instance for auth endpoints
const serverAxiosUnauthenticatedInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default serverAxiosUnauthenticatedInstance;
