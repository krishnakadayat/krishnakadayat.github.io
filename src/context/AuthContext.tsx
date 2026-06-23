import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemoUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(() => {
    return localStorage.getItem("demo_admin_active") === "true";
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsDemoUser(false);
        localStorage.removeItem("demo_admin_active");
      } else {
        // If there's a stored demo user session, maintain it
        const demoActive = localStorage.getItem("demo_admin_active") === "true";
        if (demoActive) {
          setIsDemoUser(true);
          setUser({
            uid: "admin-krishna",
            email: "krishnakadayat112@gmail.com",
            displayName: "Krishna Kadayat (Admin)",
            emailVerified: true,
            metadata: {}
          } as User);
        } else {
          setUser(null);
          setIsDemoUser(false);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const lowerEmail = email.toLowerCase().trim();
    if ((lowerEmail === "krishna" || lowerEmail === "krishna@gmail.com" || lowerEmail === "krishna@example.com" || lowerEmail === "krishnakadayat112@gmail.com") && password === "krishnakdt") {
      setIsDemoUser(true);
      setUser({
        uid: "admin-krishna",
        email: "krishnakadayat112@gmail.com",
        displayName: "Krishna Kadayat (Admin)",
        emailVerified: true,
        metadata: {}
      } as User);
      localStorage.setItem("demo_admin_active", "true");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsDemoUser(false);
      localStorage.removeItem("demo_admin_active");
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = () => {
    setIsDemoUser(true);
    setUser({
      uid: "demo-admin-krishna",
      email: "demo-krishna@ai.studio",
      displayName: "Krishna Kadayat (Demo)",
      emailVerified: true,
      metadata: {}
    } as User);
    localStorage.setItem("demo_admin_active", "true");
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setIsDemoUser(false);
      localStorage.removeItem("demo_admin_active");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemoUser, login, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
