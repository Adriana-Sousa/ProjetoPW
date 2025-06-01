import { createContext, useContext, useState, useEffect } from 'react';
import AuthServices from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Dados do usuário: { _id, fullname, email, role }
  const [token, setToken] = useState(null); // Token JWT
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação
  const { signup, login, logout, authLoading, error, success } = AuthServices();

  // Inicializa o estado com dados do localStorage
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
        localStorage.removeItem('auth'); // Remove dados inválidos
      }
    }
  }, []);

  // Função de login
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

  // Função de signup
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

  // Função de logout
  const handleLogout = () => {
    logout(); // Chama a função do serviço para limpar o localStorage
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Valor do contexto
  const value = {
    user,
    token,
    isAuthenticated,
    authLoading,
    error,
    success,
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

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};