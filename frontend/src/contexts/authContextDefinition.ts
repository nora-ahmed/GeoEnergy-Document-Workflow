
import { createContext } from "react";
import type { CurrentUser, LoginRequest } from "../types/auth";

export interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
login: (credentials: LoginRequest) => Promise<CurrentUser>;  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
