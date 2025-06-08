import { useState } from "react";

export default function usersServices() {
  const [usersLoading, setUsersLoading] = useState(false);
  const [refetchUsers, setRefetchUsers] = useState(true);
  const [usersList, setUsersList] = useState([]);

  const url = "http://localhost:3000/users";

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

 // Listar todos os usuários
  const getUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
      });
      const result = await response.json();
      if (result.success) {
        setUsersList(result.body);
        return { success: true, data: result.body };
      } else {
        console.error("Falha ao buscar usuários:", result.body?.message || "Erro desconhecido");
        return { success: false, message: result.body?.message || "Erro ao buscar usuários" };
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return { success: false, message: error.message };
    } finally {
      setUsersLoading(false);
      setRefetchUsers(false);
    }
  };

  // Atualizar um usuário
  const updateUser = async (userId, formData) => {
    setUsersLoading(true);
    try {
      // Filtra formData para enviar apenas campos preenchidos
      const filteredData = {};
      if (formData.name) filteredData.name = formData.name;
      if (formData.email) filteredData.email = formData.email;
      if (formData.role) filteredData.role = formData.role;
      if (formData.password) filteredData.password = formData.password;

      const response = await fetch(`${url}/${userId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(filteredData),
      });
      const result = await response.json();
      if (result.success) {
        setRefetchUsers(true); // Dispara atualização da lista de usuários
        return { success: true, data: result.body };
      } else {
        console.error("Falha ao atualizar usuário:", result.body?.message || "Erro desconhecido");
        return { success: false, message: result.body?.message || "Erro ao atualizar usuário" };
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return { success: false, message: error.message };
    } finally {
      setUsersLoading(false);
    }
  };

  // Excluir um usuário
  const deleteUser = async (userId) => {
    setUsersLoading(true);
    try {
      const response = await fetch(`${url}/${userId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const result = await response.json();
      if (result.success) {
        setRefetchUsers(true); // Dispara atualização da lista de usuários
        return { success: true, data: result.body };
      } else {
        console.error("Falha ao excluir usuário:", result.body?.message || "Erro desconhecido");
        return { success: false, message: result.body?.message || "Erro ao excluir usuário" };
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      return { success: false, message: error.message };
    } finally {
      setUsersLoading(false);
    }
  };

  return {
    getUsers,
    updateUser,
    deleteUser,
    usersLoading,
    refetchUsers,
    setRefetchUsers,
    usersList,
  };
}