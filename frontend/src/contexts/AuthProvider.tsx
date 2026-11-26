
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { AuthContext } from "./authContextDefinition";
import { login as loginApi, getCurrentUser } from "../api/authapi";

import type { CurrentUser, LoginRequest } from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiresAt");
    setUser(null);
  }, []);

const login = useCallback(async (credentials: LoginRequest) => {
  const result = await loginApi(credentials);

  sessionStorage.setItem("token", result.token);
  sessionStorage.setItem("expiresAt", result.expiresAt);

  const currentUser: CurrentUser = {
    userId: result.userId,
    username: result.username,
    fullName: result.fullName,
    role: result.role,
    department: result.department,
  };

  setUser(currentUser);
  return currentUser;
}, []);
  // Restore the user's session when the application loads
  useEffect(() => {
    const restoreSession = async () => {
      const token = sessionStorage.getItem("token");
      const expiresAt = sessionStorage.getItem("expiresAt");

      if (
        !token ||
        !expiresAt ||
        new Date(expiresAt).getTime() <= Date.now()
      ) {
        logout();
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
