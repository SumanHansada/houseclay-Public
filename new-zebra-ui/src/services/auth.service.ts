import axios from "axios";
import type { LoginCredentials, LoginResponse } from "../types/auth.types";

const API_URL = "http://localhost:9091";

const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.get<LoginResponse>(
      `${API_URL}/zebra/login?username=${credentials.username}&password=${credentials.password}`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },
};

export default authService;
