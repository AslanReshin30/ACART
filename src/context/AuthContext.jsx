import React, { useState } from "react";
import { AuthContext } from "./authContextObject";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("acartUser")) || null;
    } catch {
      return null;
    }
  });

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem("acartUsers") || "[]");
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((item) => item.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }

    // Demo only: never store plaintext passwords in a real application.
    users.push({ name: name.trim(), email: normalizedEmail, password });
    localStorage.setItem("acartUsers", JSON.stringify(users));

    const newUser = { name: name.trim(), email: normalizedEmail };
    localStorage.setItem("acartUser", JSON.stringify(newUser));
    setUser(newUser);
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("acartUsers") || "[]");
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (item) => item.email === normalizedEmail && item.password === password,
    );

    if (!existingUser) {
      throw new Error("Invalid email or password.");
    }

    const loggedInUser = {
      name: existingUser.name,
      email: existingUser.email,
    };

    localStorage.setItem("acartUser", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem("acartUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
