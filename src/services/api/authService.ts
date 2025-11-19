// import { apiClient } from './client';
// import { AuthResponse, LoginRequest, RegisterRequest } from '@/models/auth';

// export const authService = {
//   async login(credentials: LoginRequest): Promise<AuthResponse> {
//     const response = await apiClient.post<AuthResponse>('/Authentication/Login', credentials);
//     localStorage.setItem('token', response.token);
//     localStorage.setItem('refreshToken', response.refreshToken);
//     localStorage.setItem('user', JSON.stringify(response.user));
//     return response;
//   },

//   async register(data: RegisterRequest): Promise<AuthResponse> {
//     const response = await apiClient.post<AuthResponse>('/Authentication/Register', data);
//     localStorage.setItem('token', response.token);
//     localStorage.setItem('refreshToken', response.refreshToken);
//     localStorage.setItem('user', JSON.stringify(response.user));
//     return response;
//   },

//   async refreshToken(): Promise<AuthResponse> {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (!refreshToken) {
//       throw new Error('No refresh token available');
//     }

//     const response = await apiClient.post<AuthResponse>('/Authentication/RefreshToken', {
//       refreshToken,
//     });

//     localStorage.setItem('token', response.token);
//     localStorage.setItem('refreshToken', response.refreshToken);
//     return response;
//   },

//   logout(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//   },

//   getCurrentUser() {
//     const userStr = localStorage.getItem('user');
//     return userStr ? JSON.parse(userStr) : null;
//   },

//   isAuthenticated(): boolean {
//     return !!localStorage.getItem('token');
//   },
// };


// src/services/api/authService.ts
export const authService = {
  login: (userData: any) => {
    // بعد الـ API login
    localStorage.setItem('user', JSON.stringify(userData));
  },
  logout: () => {
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  },
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },
  isUser: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'user';
  },
};
