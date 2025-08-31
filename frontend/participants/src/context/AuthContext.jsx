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
  // No need to sync localStorage here, fetchUser is the source of truth
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/api/auth/me");
      if (res.data?.success) {
        setUser(res.data.user); // ✅ The user object is { rollNumber, houseName }
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ✅ **FIX:** Streamlined login function. It now makes the API call.
  async function login(rollNumber, otp) {
    try {
      const res = await api.post("/api/auth/otp-verify", { rollNumber, otp });
      if (res.data?.success) {
        setUser(res.data.user); // Set user from the successful login response
        setIsLoggedIn(true);
        return res.data; // Return the full response to the component
      }
      return null;
    } catch (err) {
      console.error("Login failed", err);
      setUser(null);
      setIsLoggedIn(false);
      // Re-throw or return error info so the component can handle it
      throw err; 
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