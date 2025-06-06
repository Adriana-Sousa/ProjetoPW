import { useState, useEffect } from 'react';
import { AuthContext } from './authContext';
import AuthServices from '../services/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [success, setSuccess] = useState(null);

    // Importando os serviços de autenticação
  const { signup, login, logout, authLoading, error  } = AuthServices();

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.token && authData.user) {
          setToken(authData.token);
          setUser(authData.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Erro ao ler auth do localStorage:', err);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const handleLogin = async (formData) => {
    try {
      const result = await login(formData);
      if (result.success) {
        setToken(result.data.token);
        setUser(result.data.user);
        setIsAuthenticated(true);
      }
      return result;
    } catch (err) {
      console.error('Erro no login:', err);
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const handleSignup = async (formData) => {
    try {
      const result = await signup(formData);
      if (result.success) {
        setToken(result.data.token);
        setUser(result.data.user);
        setIsAuthenticated(true);
      }
      return result;
    } catch (err) {
      console.error('Erro no signup:', err);
      return { success: false, error: 'Erro ao cadastrar' };
    }
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    authLoading,
    error,
    success,
    setSuccess,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,

  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
