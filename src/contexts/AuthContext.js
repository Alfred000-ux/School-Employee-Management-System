import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 🔁 Decode token whenever it changes
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, [token]);

  // ✅ MOCK LOGIN (ADMIN)
  const login = async (email, password) => {
    try {
      // Admin mock user payload
      const payload = {
        id: 1,
        email: email || "admin@test.com",
        name: "Admin User",
        role: "admin", // 🔥 THIS IS THE FIX
      };

      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        btoa(JSON.stringify(payload)) +
        ".mock_signature";

      localStorage.setItem("token", mockToken);
      setToken(mockToken);
      setUser(payload);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ✅ MOCK REGISTER (ADMIN)
  const register = async (userData) => {
    try {
      const payload = {
        id: 1,
        email: userData.email,
        name: userData.name,
        role: "admin", // 🔥 ENSURE ADMIN
      };

      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        btoa(JSON.stringify(payload)) +
        ".mock_signature";

      localStorage.setItem("token", mockToken);
      setToken(mockToken);
      setUser(payload);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // 🔐 AUTH HELPERS
  const isAuthenticated = () => !!user;

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
