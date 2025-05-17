export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  access_token: string;
  // Add other response fields if needed
}
