import api from './index';
import type { LoginCredentials, RegisterData } from '../types/auth';

export const auth = {
  login: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  
  register: (data: RegisterData) => 
    api.post('/auth/register', data),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getCurrentUser: () => 
    api.get('/auth/me')
};