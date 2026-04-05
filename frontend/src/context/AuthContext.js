"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "../api/userApi";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) setToken(storedToken);
    } catch {}

    setIsHydrated(true);
  }, []);

  const {
    data: userFromApiData,
    isLoading: loadingUser,
    isError: userError,
    error: userErrorObj,
    refetch,
  } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token && userFromApiData?.user) {
      const u = userFromApiData.user;
      setUser({
        id: u.id,
        name: u.username,
        username: u.username,
        email: u.email,
        role: u.role || "user",
        avatar: u.photo || "https://via.placeholder.com/150",
        photo: u.photo,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      });
    } else {
      setUser(null);
    }
  }, [userFromApiData, token]);

  const login = (jwtToken) => {
    if (!jwtToken) return;
    localStorage.setItem("authToken", jwtToken);
    setToken(jwtToken);
    refetch();
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoggedIn: !!token && !!user,
    isLoading: loadingUser,
    isError: userError,
    error: userErrorObj,
    login,
    logout,
    refetchUser: refetch,
  };

  if (!isHydrated) return null; // 🚀 CRITICAL LINE

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
