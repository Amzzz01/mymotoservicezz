import React, { createContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  register: (user: User) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('moto-users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('moto-currentUser', null);

  const register = (user: User): boolean => {
    const userExists = users.some(u => u.username === user.username);
    if (userExists) {
      return false; // Username already taken
    }
    setUsers([...users, user]);
    return true;
  };

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false; // Invalid credentials
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
