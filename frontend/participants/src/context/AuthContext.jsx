import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        if (decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        } else {
          setUser(decodedUser);
          setToken(storedToken);
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, otp) => {
    try {
      const response = await axios.post("http://localhost:8080/login/otp-verify", {
        teamName: email,
        otp: otp
      });

      if (response.data.success && response.data.token) {
        const receivedToken = response.data.token;
        localStorage.setItem('authToken', receivedToken);
        const decodedUser = jwtDecode(receivedToken);
        
        setUser(decodedUser);
        setToken(receivedToken);
        
        return decodedUser;
      }
      return null;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const value = { user, token, loading, login, logout };

  if (loading) {
    return <div>Loading Application...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};