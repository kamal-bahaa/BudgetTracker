export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ErrorResponse {
  status: string;
  message: string;
}