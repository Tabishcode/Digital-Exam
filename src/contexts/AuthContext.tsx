import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'admin';
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (name: string, email: string, password: string, profileImage: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyFace: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('secureExamUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ✅ Replace this with actual API call
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/signin', { email, password });
      const userData: User = res.data.user;
      const token = res.data.token; // Extract the token from the response
      console.log('role:', userData.role);
      setUser({ ...userData, token }); // Add the token to the user object
      localStorage.setItem('secureExamUser', JSON.stringify({ ...userData, token })); // Store the token in localStorage if needed
      console.log('Login successful:', { ...userData, token });
    } catch (err: any) {
      console.error('Login failed:', err);
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, profileImage: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, profileImage }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await res.json();
      const userData: User = data.user;
      const token = data.token;

      setUser({ ...userData, token });
      localStorage.setItem('secureExamUser', JSON.stringify({ ...userData, token }));
      console.log('Signup successful:', { ...userData, token });
    } catch (err: any) {
      console.error('Signup failed:', err);
      throw new Error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };



  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('secureExamUser');
  };

  // Fake facial verification (you can update this later)
  const verifyFace = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 2000));
    const isVerified = Math.random() < 0.95;
    setLoading(false);
    return isVerified;
  };

  return (
    <AuthContext.Provider value={{ user, signup, loading, login, logout, verifyFace }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
