"use client";

import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContextType, Role, User } from "../types";
import { apiClient } from "../lib/apiClient";

type LoginState = {
  success?: boolean;
  error?: string;
  user?: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [loginState, loginAction, isLoginPending] = useActionState(
    async (
      previousState: LoginState,
      formData: FormData
    ): Promise<LoginState> => {
      const email = formData.get("email") as string;
      const password = formData.get("Password") as string;
      try {
        const loginResponse = (await apiClient.login(
          email,
          password
        )) as unknown as { user: User };
        setUser(loginResponse.user);
        return { success: true, user: loginResponse.user };
      } catch (error) {
        console.log("Error while login", error);
        return {
          success: false,
          error: "Login failed",
          user: null,
        };
      }
    },
    {
      error: undefined,
      success: undefined,
      user: undefined,
    } as LoginState
  );

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.log("Logout error", error);
    }
  };

  const hasPermission = (requiredRole: Role): boolean => {
    if (!user) return false;
    const roleHierarchy = {
      [Role.GUEST]: 0,
      [Role.USER]: 1,
      [Role.MANAGER]: 2,
      [Role.ADMIN]: 3,
    };
    return roleHierarchy[user?.role] >= roleHierarchy[requiredRole];
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData || null);
      } catch (error) {
        console.log("Failed to load user", error);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginAction,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContextProvider;
