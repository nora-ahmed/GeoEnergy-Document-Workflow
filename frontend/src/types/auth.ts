
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  userId: number;
  username: string;
  fullName: string;
  role: "Engineer" | "Manager";
  department: string;
}

export interface CurrentUser {
  userId: number;
  username: string;
  fullName: string;
  role: "Engineer" | "Manager";
  department: string;
}
