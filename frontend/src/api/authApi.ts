
import api from "./axios";
import type {
  LoginRequest,
  LoginResponse,
  CurrentUser,
} from "../types/auth";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/Auth/login",
    credentials
  );

  return response.data;
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get<CurrentUser>("/Auth/me");

  return response.data;
};
