import axios from 'axios';
import type { 
  Admin, 
  LoginCredentials, 
  RegisterData, 
  Token, 
  PasswordChange,
  Article,
  ArticleCreate,
  ArticleUpdate 
} from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH APIs

export const authApi = {
  // Register new admin
  register: async (data: RegisterData): Promise<Admin> => {
    const response = await api.post<Admin>('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<Token> => {
    
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<Token>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Get current admin info
  getCurrentAdmin: async (): Promise<Admin> => {
    const response = await api.get<Admin>('/admin/me');
    return response.data;
  },

  // Change password
  changePassword: async (data: PasswordChange): Promise<{ message: string }> => {
    const response = await api.put('/admin/change-password', data);
    return response.data;
  },
};

// ADMIN APIs

export const adminApi = {
  // Create new admin (super admin only)
  createAdmin: async (data: RegisterData): Promise<Admin> => {
    const response = await api.post<Admin>('/admin/create', data);
    return response.data;
  },

  // List all admins
  listAdmins: async (): Promise<Admin[]> => {
    const response = await api.get<Admin[]>('/admin/list');
    return response.data;
  },

  // Get specific admin
  getAdmin: async (adminId: number): Promise<Admin> => {
    const response = await api.get<Admin>(`/admin/${adminId}`);
    return response.data;
  },

  // Delete admin
  deleteAdmin: async (adminId: number): Promise<void> => {
    await api.delete(`/admin/${adminId}`);
  },

  // Toggle admin active status
  toggleActive: async (adminId: number): Promise<Admin> => {
    const response = await api.patch<Admin>(`/admin/${adminId}/toggle-active`);
    return response.data;
  },
};

// ARTICLE APIs

export const articleApi = {
  // Get all articles (public)
  getArticles: async (params?: { 
    skip?: number; 
    limit?: number; 
    published_only?: boolean 
  }): Promise<Article[]> => {
    const response = await api.get<Article[]>('/articles/', { params });
    return response.data;
  },

  // Get single article by ID
  getArticle: async (articleId: number): Promise<Article> => {
    const response = await api.get<Article>(`/articles/${articleId}`);
    return response.data;
  },

  // Get article by slug (for public blog)
  getArticleBySlug: async (slug: string): Promise<Article> => {
    const response = await api.get<Article>(`/articles/slug/${slug}`);
    return response.data;
  },

  // Create article (with image)
  createArticle: async (data: FormData): Promise<Article> => {
    const response = await api.post<Article>('/articles/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update article
  updateArticle: async (articleId: number, data: FormData): Promise<Article> => {
    const response = await api.put<Article>(`/articles/${articleId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete article
  deleteArticle: async (articleId: number): Promise<void> => {
    await api.delete(`/articles/${articleId}`);
  },

  // Toggle publish status
  togglePublish: async (articleId: number): Promise<Article> => {
    const response = await api.patch<Article>(`/articles/${articleId}/publish`);
    return response.data;
  },

  // Get articles by author
  getArticlesByAuthor: async (authorId: number, params?: { 
    skip?: number; 
    limit?: number 
  }): Promise<Article[]> => {
    const response = await api.get<Article[]>(`/articles/author/${authorId}`, { params });
    return response.data;
  },
};

// Export the base api instance for custom requests
export default api;