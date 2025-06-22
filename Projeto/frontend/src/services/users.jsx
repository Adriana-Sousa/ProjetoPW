// src/services/usersServices.js
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function useUsersServices() {
  const [usersLoading, setUsersLoading] = useState(false);
  const [refetchUsers, setRefetchUsers] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [error, setError] = useState('');
  const [sucess, setSucess] = useState('');
  const { token } = useAuth();

  const baseUrl = 'http://localhost:3000/users';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  });

  // Função auxiliar para lidar com fetch
  const handleFetch = async (url, options) => {
    setUsersLoading(true);
    setError('');
    try {
      console.log(`Requisição: ${options.method} ${url}`, options.body ? JSON.parse(options.body) : {});
      const response = await fetch(url, {
        ...options,
        headers: getHeaders(),
      });
      const result = await response.json();
      console.log(`Resposta: ${options.method} ${url}`, { status: response.status, result });
      return {
        success: result.success,
        data: result.body,
        error: result.body?.message || 'Erro desconhecido',
        statusCode: result.statusCode || response.status,
      };
    } catch (err) {
      console.error(`Erro de rede: ${options.method} ${url}`, err.message);
      setError(err.message || 'Erro de conexão');
      return { success: false, error: err.message, statusCode: 500 };
    } finally {
      setUsersLoading(false);
    }
  };

  // Listar todos os usuários
  const getUsers = async () => {
    const result = await handleFetch(baseUrl, { method: 'GET' });
    if (result.success) {
      setUsersList(result.data || []);
      setRefetchUsers(false);
    }
    return result;
  };

  // Atualizar um usuário
  const updateUser = async (userId, formData) => {
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      setError('ID de usuário inválido');
      return { success: false, error: 'ID de usuário inválido', statusCode: 400 };
    }
    if (!formData || Object.keys(formData).length === 0) {
      setError('Dados de atualização são obrigatórios');
      return { success: false, error: 'Dados de atualização são obrigatórios', statusCode: 400 };
    }

    // Filtrar campos preenchidos
    const filteredData = {};
    if (formData.name) filteredData.name = formData.name;
    if (formData.email) filteredData.email = formData.email;
    if (formData.role) filteredData.role = formData.role;
    if (formData.password) filteredData.password = formData.password;

    const result = await handleFetch(`${baseUrl}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(filteredData),
    });
    if (result.success) {
      setRefetchUsers(true);
    }
    return result;
  };

  // Excluir um usuário
  const deleteUser = async (userId) => {
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      setError('ID de usuário inválido');
      return { success: false, error: 'ID de usuário inválido', statusCode: 400 };
    }

    const result = await handleFetch(`${baseUrl}/${userId}`, {
      method: 'DELETE',
    });
    if (result.success) {
      setRefetchUsers(true);
    }
    return result;
  };

  // Alterar senha
  const changePassword = async (userId, { oldPassword, newPassword }) => {
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      setError('ID de usuário inválido');
      return { success: false, error: 'ID de usuário inválido', statusCode: 400 };
    }
    if (!oldPassword || !newPassword) {
      setError('Senhas antiga e nova são obrigatórias');
      return { success: false, error: 'Senhas antiga e nova são obrigatórias', statusCode: 400 };
    }

    const result = await handleFetch(`${baseUrl}/${userId}/changePassword`, {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return result;
  };

  return {
    getUsers,
    updateUser,
    deleteUser,
    changePassword,
    usersLoading,
    refetchUsers,
    setRefetchUsers,
    usersList,
    error,
    setError,
  
  };
}