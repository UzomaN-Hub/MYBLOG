// Admin/User types
export interface Admin {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_super_admin: boolean;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface PasswordChange {
  old_password: string;
  new_password: string;
}

// Article types
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author_id: number;
  published: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface ArticleCreate {
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
}

export interface ArticleUpdate {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
}

// API Response types
export interface ApiError {
  detail: string;
}

// Category/Topic types (for later)
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}