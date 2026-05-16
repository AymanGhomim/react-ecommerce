import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("userToken") || null);
  const [user, setUser]   = useState(() => {
    const u = localStorage.getItem("authUser");
    return u ? JSON.parse(u) : null;
  });

  const saveToken = (tok, userData) => {
    localStorage.setItem("userToken", tok);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setToken(tok);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
