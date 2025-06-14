import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function useFavoritesServices() {
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState('');
  const [favoritesList, setFavoritesList] = useState([]);
  const [refetchFavorites, setRefetchFavorites] = useState(true);
  const { token, user } = useAuth();

  const baseUrl = 'http://localhost:3000/favorites';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  });

  const handleFetch = async (url, options) => {
    setFavoritesLoading(true);
    setFavoritesError('');
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
      setFavoritesError(err.message || 'Erro de conexão');
      return { success: false, error: err.message, statusCode: 500 };
    } finally {
      setFavoritesLoading(false);
    }
  };

  const getFavorites = async () => {
    const result = await handleFetch(baseUrl, { method: 'GET' });
    if (result.success) {
      setFavoritesList(result.data.plates || []);
      setRefetchFavorites(false);
    }
    return result;
  };

  const addFavorite = async (plateId) => {
    if (!/^[0-9a-fA-F]{24}$/.test(plateId)) {
      setFavoritesError('ID de prato inválido');
      return { success: false, error: 'ID de prato inválido', statusCode: 400 };
    }
    const result = await handleFetch(`${baseUrl}/${plateId}`, { method: 'POST' });
    if (result.success) {
      setRefetchFavorites(true); // Forçar recarregamento dos favoritos
    }
    return result;
  };

  const removeFavorite = async (plateId) => {
    if (!/^[0-9a-fA-F]{24}$/.test(plateId)) {
      setFavoritesError('ID de prato inválido');
      return { success: false, error: 'ID de prato inválido', statusCode: 400 };
    }
    const result = await handleFetch(`${baseUrl}/${plateId}`, { method: 'DELETE' });
    if (result.success) {
      setRefetchFavorites(true); // Forçar recarregamento dos favoritos
    }
    return result;
  };

  const updateFavorites = async (plateIds) => {
    if (!Array.isArray(plateIds) || plateIds.some(id => !/^[0-9a-fA-F]{24}$/.test(id))) {
      setFavoritesError('Lista de IDs de pratos inválida');
      return { success: false, error: 'Lista de IDs de pratos inválida', statusCode: 400 };
    }
    const result = await handleFetch(baseUrl, {
      method: 'PUT',
      body: JSON.stringify({ plateIds }),
    });
    if (result.success) {
      setRefetchFavorites(true); // Forçar refetch para obter a lista atualizada
    }
    return result;
  };

  return {
    getFavorites,
    addFavorite,
    removeFavorite,
    updateFavorites,
    favoritesLoading,
    favoritesError,
    favoritesList,
    refetchFavorites,
  };
}