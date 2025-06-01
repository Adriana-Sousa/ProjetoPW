import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Exemplo: { role: 'admin' } ou { role: 'client' }

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
const authData = JSON.parse(localStorage.getItem('auth'))
  
export const autenticado = authData? true : false
export const adminRole = authData?.user?.role === "admin" ? true: false
