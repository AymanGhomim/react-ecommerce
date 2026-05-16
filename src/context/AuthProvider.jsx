import { useState } from "react";
import { AuthContext } from "./AuthContext";

const DEMO_USERS = [
  { email: "admin@store.com", password: "123456", name: "Admin User" },
  { email: "user@store.com",  password: "123456", name: "John Doe" },
];

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email, password) => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const userData = { email: found.email, name: found.name };
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  };

  const register = (name, email, password) => {
    const exists = DEMO_USERS.find((u) => u.email === email);
    if (exists) return { success: false, error: "Email already registered" };
    const newUser = { email, password, name };
    DEMO_USERS.push(newUser);
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
