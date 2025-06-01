// src/services/usePlatesServices.js
import { useState } from 'react';
import { useAuth } from '../context/authContext';

export default function PlatesServices() {
  const [platesLoading, setPlatesLoading] = useState(false);
  const [refetchPlates, setRefetchPlates] = useState(true);
  const [platesList, setPlatesList] = useState([]);
  const { token } = useAuth();

  const baseUrl = 'http://localhost:3000/plates';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  });

  // Listar pratos disponíveis
  const getAvailablePlates = async () => {
    setPlatesLoading(true);
    try {
      const response = await fetch(`${baseUrl}/availables`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setPlatesList(result.body);
        return { success: true, data: result.body };
      } else {
        return {
          success: false,
          message: result.body?.message || 'Erro ao buscar pratos disponíveis',
          status: response.status,
        };
      }
    } catch (error) {
      return { success: false, message: error.message, status: 500 };
    } finally {
      setPlatesLoading(false);
      setRefetchPlates(false);
    }
  };

  // Listar todos os pratos
  const getPlates = async () => {
    setPlatesLoading(true);
    try {
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: getHeaders(),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setPlatesList(result.body);
        return { success: true, data: result.body };
      } else {
        return {
          success: false,
          message: result.body?.message || 'Erro ao buscar pratos',
          status: response.status,
        };
      }
    } catch (error) {
      return { success: false, message: error.message, status: 500 };
    } finally {
      setPlatesLoading(false);
      setRefetchPlates(false);
    }
  };

  // Adicionar um novo prato
  const addPlate = async (formData) => {
    const { name, price, description, ingredients, imgUrl, category } = formData;
    if (!name || !price || price <= 0) {
      return { success: false, message: 'Nome e preço válido são obrigatórios' };
    }
    if (ingredients && !Array.isArray(ingredients)) {
      return { success: false, message: 'Ingredientes devem ser uma lista' };
    }
    if (category && !['entrada', 'principal', 'sobremesa', 'bebida'].includes(category)) {
      return { success: false, message: 'Categoria inválida' };
    }
    setPlatesLoading(true);
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setRefetchPlates(true);
        return { success: true, data: result.body };
      } else {
        return {
          success: false,
          message: result.body?.message || 'Erro ao adicionar prato',
          status: response.status,
        };
      }
    } catch (error) {
      return { success: false, message: error.message, status: 500 };
    } finally {
      setPlatesLoading(false);
    }
  };

  // Atualizar um prato existente
  const updatePlate = async (plateId, formData) => {
    if (!plateId || !formData.name || !formData.price || formData.price <= 0) {
      return { success: false, message: 'ID, nome e preço válido são obrigatórios' };
    }
    if (formData.ingredients && !Array.isArray(formData.ingredients)) {
      return { success: false, message: 'Ingredientes devem ser uma lista' };
    }
    if (formData.category && !['entrada', 'principal', 'sobremesa', 'bebida'].includes(formData.category)) {
      return { success: false, message: 'Categoria inválida' };
    }
    setPlatesLoading(true);
    try {
      const response = await fetch(`${baseUrl}/${plateId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setRefetchPlates(true);
        return { success: true, data: result.body };
      } else {
        return {
          success: false,
          message: result.body?.message || 'Erro ao atualizar prato',
          status: response.status,
        };
      }
    } catch (error) {
      return { success: false, message: error.message, status: 500 };
    } finally {
      setPlatesLoading(false);
    }
  };

  // Excluir um prato
  const deletePlate = async (plateId) => {
    if (!plateId) {
      return { success: false, message: 'ID do prato é obrigatório' };
    }
    setPlatesLoading(true);
    try {
      const response = await fetch(`${baseUrl}/${plateId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setRefetchPlates(true);
        return { success: true, data: result.body };
      } else {
        return {
          success: false,
          message: result.body?.message || 'Erro ao excluir prato',
          status: response.status,
        };
      }
    } catch (error) {
      return { success: false, message: error.message, status: 500 };
    } finally {
      setPlatesLoading(false);
    }
  };

  return {
    getAvailablePlates,
    getPlates,
    addPlate,
    updatePlate,
    deletePlate,
    platesLoading,
    refetchPlates,
    setRefetchPlates,
    platesList,
  };
}