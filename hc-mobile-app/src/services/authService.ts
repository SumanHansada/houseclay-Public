import axiosInstance from './axiosInstance';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<LoginResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    axiosInstance.post('/auth/register', payload),

  refreshToken: (refreshToken: string) =>
    axiosInstance.post<LoginResponse>('/auth/refresh', {refreshToken}),

  logout: () => axiosInstance.post('/auth/logout'),
};
