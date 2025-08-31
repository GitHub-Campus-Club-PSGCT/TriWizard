import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/api/auth/me");
      if (res.data?.success) {
        setUser(res.data.user);
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
      } else {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
      }
    } catch {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  async function login(teamName, otp) {
    try {
      const res = await api.post("/api/auth/otp-verify", { teamName, otp });
      if (res.data?.success) {
        await fetchUser();
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        return res.data;
      }
      return null;
    } catch (err) {
      console.error("Login failed", err);
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      return null;
    }
  }

  async function logout() {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
