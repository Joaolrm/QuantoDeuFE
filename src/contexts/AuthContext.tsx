"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { apiService, PeopleAddEventsDTO } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: PeopleAddEventsDTO | null;
  loading: boolean;
  login: (phoneNumber: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PeopleAddEventsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const savedUser = localStorage.getItem("quantoDeuUser");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
    setLoading(false);
  }, []);

  const login = async (phoneNumber: string) => {
    try {
      setLoading(true);
      const userData = await apiService.getPeopleEventsByPhone(phoneNumber);
      setUser(userData);
      localStorage.setItem("quantoDeuUser", JSON.stringify(userData));
      router.push("/main");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      const newUser = await apiService.createPeople(userData);
      const userWithEvents = { ...newUser, events: [] };
      setUser(userWithEvents);
      localStorage.setItem("quantoDeuUser", JSON.stringify(userWithEvents));
      router.push("/main");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quantoDeuUser");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
