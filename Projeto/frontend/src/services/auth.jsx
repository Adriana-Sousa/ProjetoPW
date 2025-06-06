import { useState } from "react";
export default function AuthServices() {
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const baseUrl = 'http://localhost:3000/auth'; 

  // Função para obter o estado de autenticação do localStorage
  const getAuthData = () => {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        return JSON.parse(authData); // Retorna { token, user } ou null
      }
      return null;
    } catch (err) {
      setError("Erro ao ler dados de autenticação");
      console.error('Erro ao parsear auth do localStorage:', err);
      return null;
    }
  };

  // Função auxiliar para lidar com fetch
  const handleFetch = async (endpoint, options) => {
    setAuthLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (result.success && result.body?.token) {
        localStorage.setItem(
          'auth',
          JSON.stringify({ token: result.body.token, user: result.body.user })
        );
        setSuccess("Operação realizada com sucesso!");
        return { success: true, data: result.body, statusCode: response.status };
      } else {
        setError(result.body || "Erro na operação");
        return { success: false, error: result.body || "Erro desconhecido", statusCode: response.status };
      }
    } catch (error) {
      setError("Falha na comunicação com o servidor");
      return { success: false, error: error.message, statusCode: 500 };
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (formData) => {
    return await handleFetch('login', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  };

  const signup = async (formData) => {
    return await handleFetch('signup', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('carrinho');
    setSuccess("Logout realizado com sucesso!");
    return { success: true };
  };

  return {
    signup,
    login,
    logout,
    authLoading,
    error,
    success,
    getAuthData
  };
}
