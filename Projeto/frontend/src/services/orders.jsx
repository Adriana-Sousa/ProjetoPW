import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

// Regex para validar ObjectId (24 caracteres hexadecimais)
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Validar formato de horário (HH:mm)
const isValidTime = (time) => /^([0-1]\d|2[0-3]):[0-5]\d$/.test(time);

// Validar formato de data (YYYY-MM-DD)
const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

// Validar status de retirada
const validPickupStatuses = ['Pendente', 'Preparando', 'Entregue', 'Cancelado'];
const isValidPickupStatus = (status) => validPickupStatuses.includes(status);

export default function useOrderServices() {
  const [orderLoading, setOrderLoading] = useState(false);
  const [refetchOrders, setRefetchOrders] = useState(true);
  const [ordersList, setOrdersList] = useState([]);
  const { token } = useAuth();

  const baseUrl = 'http://localhost:3000/orders';

  // Obter token de autenticação
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  });

  // Função auxiliar para lidar com fetch e erros
  const handleFetch = async (url, options) => {
    setOrderLoading(true);
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
        data: result.success ? result.body : null,
        error: result.success ? null : result.body?.message || 'Erro desconhecido',
        statusCode: result.statusCode || response.status,
      };
    } catch (error) {
      console.error(`Erro de rede: ${options.method} ${url}`, error.message);
      return {
        success: false,
        error: `Erro de conexão: ${error.message}`,
        statusCode: 500,
      };
    } finally {
      setOrderLoading(false);
    }
  };

  // Pegar todas as ordens
  const getAllOrders = async () => {
    const result = await handleFetch(`${baseUrl}/`, { method: 'GET' });
    if (result.success) {
      setOrdersList(result.data || []);
      setRefetchOrders(false);
    }
    return result;
  };

  // Pegar ordens por usuário
  const getUserOrders = async (userId) => {
    if (!isValidObjectId(userId)) {
      console.error('getUserOrders: ID de usuário inválido:', userId);
      return { success: false, error: 'ID de usuário inválido', statusCode: 400 };
    }
    const result = await handleFetch(`${baseUrl}/user/${userId}`, { method: 'GET' });
    if (result.success) {
      setOrdersList(result.data || []);
      setRefetchOrders(false);
    }
    return result;
  };

  // Validar orderData
  const validateOrderData = (orderData, isUpdate = false) => {
    const errors = [];

    // Validações para criação (sendOrder) e atualização (updateOrder)
    if (!isUpdate) {
      if (!orderData.userId || !isValidObjectId(orderData.userId)) {
        errors.push('ID de usuário inválido');
      }
      if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        errors.push('Itens do pedido são obrigatórios e devem ser uma lista não vazia');
      } else {
        orderData.items.forEach((item, index) => {
          if (!item.plateId || !isValidObjectId(item.plateId)) {
            errors.push(`Item ${index + 1}: ID do prato inválido`);
          }
          if (item.quantity && (!Number.isInteger(item.quantity) || item.quantity <= 0)) {
            errors.push(`Item ${index + 1}: Quantidade inválida`);
          }
        });
      }
    }

    // Validações para pickupTime, pickupDate, pickupStatus (opcionais)
    if (orderData.pickupTime && !isValidTime(orderData.pickupTime)) {
      errors.push('Horário de retirada inválido (formato: HH:mm)');
    }
    if (orderData.pickupDate && !isValidDate(orderData.pickupDate)) {
      errors.push('Data de retirada inválida (formato: YYYY-MM-DD)');
    }
    if (orderData.pickupStatus && !isValidPickupStatus(orderData.pickupStatus)) {
      errors.push(`Status de retirada inválido. Valores permitidos: ${validPickupStatuses.join(', ')}`);
    }

    // Para atualização, garantir que há pelo menos um campo para atualizar
    if (isUpdate && Object.keys(orderData).length === 0) {
      errors.push('Nenhum dado fornecido para atualização');
    }

    return errors.length > 0 ? errors : null;
  };

  // Adicionar uma ordem
  const sendOrder = async (orderData) => {
    const validationErrors = validateOrderData(orderData);
    if (validationErrors) {
      console.error('sendOrder: Dados inválidos:', validationErrors);
      return { success: false, error: validationErrors.join('; '), statusCode: 400 };
    }

    const result = await handleFetch(`${baseUrl}/`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    if (result.success) {
      setRefetchOrders(true);
    }
    return result;
  };

  // Deletar uma ordem
  const deleteOrder = async (orderId) => {
    if (!isValidObjectId(orderId)) {
      console.error('deleteOrder: ID de ordem inválido:', orderId);
      return { success: false, error: 'ID de ordem inválido', statusCode: 400 };
    }

    const result = await handleFetch(`${baseUrl}/${orderId}`, {
      method: 'DELETE',
    });
    if (result.success) {
      setRefetchOrders(true);
    }
    return result;
  };

  // Editar uma ordem
  const updateOrder = async (orderId, orderData) => {
    if (!isValidObjectId(orderId)) {
      console.error('updateOrder: ID de ordem inválido:', orderId);
      return { success: false, error: 'ID de ordem inválido', statusCode: 400 };
    }

    const validationErrors = validateOrderData(orderData, true);
    if (validationErrors) {
      console.error('updateOrder: Dados inválidos:', validationErrors);
      return { success: false, error: validationErrors.join('; '), statusCode: 400 };
    }

    const result = await handleFetch(`${baseUrl}/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
    if (result.success) {
      setRefetchOrders(true);
    }
    return result;
  };

  return {
    orderLoading,
    refetchOrders,
    setRefetchOrders,
    ordersList,
    getAllOrders,
    getUserOrders,
    sendOrder,
    deleteOrder,
    updateOrder,
  };
}
