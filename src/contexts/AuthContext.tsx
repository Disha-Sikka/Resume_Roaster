import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: (email: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, name: string) => Promise<void>;
  logout: () => void;
  enterGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("roaster_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("roaster_user");
      }
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async (email: string, name: string) => {
    setLoading(true);
    const profile: UserProfile = {
      email,
      name,
      isGuest: false,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
    };
    setUser(profile);
    localStorage.setItem("roaster_user", JSON.stringify(profile));
    setLoading(false);
  };

  const loginWithEmail = async (email: string, name: string) => {
    setLoading(true);
    const profile: UserProfile = {
      email,
      name: name || email.split("@")[0],
      isGuest: false,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
    };
    setUser(profile);
    localStorage.setItem("roaster_user", JSON.stringify(profile));
    setLoading(false);
  };

  const enterGuestMode = () => {
    const profile: UserProfile = {
      email: "guest@resumeroaster.ai",
      name: "Guest Roaster",
      isGuest: true,
      avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=guest",
    };
    setUser(profile);
    localStorage.setItem("roaster_user", JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("roaster_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        logout,
        enterGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
