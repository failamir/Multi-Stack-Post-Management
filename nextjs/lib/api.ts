const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Authentication methods
  async register(name: string, email: string, password: string, passwordConfirmation: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse(response);
    localStorage.removeItem('auth_token');
  }

  async getUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<User>(response);
  }

  // Posts methods
  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      headers: this.getAuthHeaders(),
    });

    const data = await this.handleResponse<{ data: Post[] }>(response);
    return data.data;
  }

  async getPost(id: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Post>(response);
  }

  async createPost(title: string, content: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ title, content }),
    });

    return this.handleResponse<Post>(response);
  }

  async updatePost(id: string, title: string, content: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ title, content }),
    });

    return this.handleResponse<Post>(response);
  }

  async deletePost(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();