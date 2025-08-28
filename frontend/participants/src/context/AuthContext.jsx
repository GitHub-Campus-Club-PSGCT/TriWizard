import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // send/receive httpOnly cookies
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/api/auth/me");
      if (res.data?.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
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
        // Do NOT read or store JWT on FE. Cookie is already set by server.
        await fetchUser(); // confirm session from server
        return res.data;   // contains teamName/houseName for immediate UI if needed
      }
      return null;
    } catch (err) {
      console.error("Login failed", err);
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
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
