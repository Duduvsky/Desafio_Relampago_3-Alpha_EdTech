import api from '../config/api';
import { type User } from '../types/user'; 

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  user: User; 
}

interface CheckTokenResponse {
  valid: boolean;
  user: User; 
}

export const AuthService = {
  async login(data: LoginData) {
    return api.post<LoginResponse>('/auth/login', data);
  },

  async register(data: RegisterData) {
    return api.post('/users', data);
  },

  async logout() {
    return api.post('/auth/logout');
  },

  async checkToken() {
    return api.get<CheckTokenResponse>('/auth/check-token');
  }
};