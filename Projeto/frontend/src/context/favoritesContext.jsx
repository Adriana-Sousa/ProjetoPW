import { createContext, useContext, useState, useEffect } from 'react';
import useFavoritesServices from '../services/favorites';
import { useAuth } from '../hooks/useAuth';

// Criar o contexto
const FavoritesContext = createContext();

// Hook para acessar o contexto
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
};

export function FavoritesProvider({ children }) {
  const { getFavorites, updateFavorites, favoritesLoading, favoritesError } = useFavoritesServices();
  const { isAuthenticated, user } = useAuth();
  const [favoritesList, setFavoritesList] = useState([]);
  const [refetchFavorites, setRefetchFavorites] = useState(true);

  // Função para carregar favoritos do localStorage
  const loadFavoritesFromStorage = () => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) {
          console.log('FavoritesProvider: Favoritos carregados do localStorage:', parsedFavorites);
          setFavoritesList(parsedFavorites);
          return parsedFavorites;
        } else {
          console.error('FavoritesProvider: Dados do localStorage não são um array:', parsedFavorites);
          return [];
        }
      }
      return [];
    } catch (error) {
      console.error('FavoritesProvider: Erro ao carregar do localStorage:', error.message);
      return [];
    }
  };

  // Função para salvar favoritos no localStorage
  const saveFavoritesToStorage = (favorites) => {
    const favoritesArray = Array.isArray(favorites) ? favorites : [];
    console.log('FavoritesProvider: Salvando favoritos no localStorage:', favoritesArray);
    localStorage.setItem('favorites', JSON.stringify(favoritesArray));
    setFavoritesList(favoritesArray);
  };

  // Carregar favoritos após login
  useEffect(() => {
    console.log('FavoritesProvider: useEffect disparado', { isAuthenticated, userId: user?._id, role: user?.role, refetchFavorites });
    if (isAuthenticated && user?._id) {
      console.log("favorites")
      console.log(refetchFavorites)
      if (refetchFavorites) {
        console.log('FavoritesProvider: Carregando favoritos...');
        if (user.role === 'client') {
          const storedFavorites = loadFavoritesFromStorage();
          if (storedFavorites.length === 0) {
            console.log('FavoritesProvider: Carregando favoritos do banco para usuário:', user._id);
            getFavorites()
              .then((result) => {
                if (result.success) {
                  const data = Array.isArray(result.data.plates) ? result.data.plates : [];
                  console.log('FavoritesProvider: Favoritos carregados do banco:', data);
                  saveFavoritesToStorage(data);
                  setRefetchFavorites(false);
                } else {
                  console.error('FavoritesProvider: Erro ao carregar favoritos:', result.error);
                  setFavoritesList([]);
                  setRefetchFavorites(false);
                }
              })
              .catch((err) => {
                console.error('FavoritesProvider: Erro inesperado ao carregar favoritos:', err.message);
                setFavoritesList([]);
                setRefetchFavorites(false);
              });
          } else {
            setRefetchFavorites(false);
          }
        } else {
          console.log('FavoritesProvider: Usuário não é cliente, ignorando favoritos');
          setRefetchFavorites(false);
        }
      }
    }
  }, [isAuthenticated, user?._id, user?.role, getFavorites, refetchFavorites]);

  // Alternar favorito (adicionar ou remover)
  const toggleFavorito = (prato) => {
    if (!isAuthenticated || !user?._id) {
      console.warn('FavoritesProvider: Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }
    if (!prato?._id) {
      console.error('FavoritesProvider: Prato inválido:', prato);
      return { success: false, error: 'Prato inválido' };
    }

    const isFavorito = Array.isArray(favoritesList) && favoritesList.some((f) => f._id === prato._id);
    console.log('FavoritesProvider: Alternando favorito:', { plateId: prato._id, isFavorito });

    let updatedFavorites;
    if (isFavorito) {
      updatedFavorites = favoritesList.filter((f) => f._id !== prato._id);
    } else {
      const newFavorite = { _id: prato._id, name: prato.name || 'Prato', ...prato };
      updatedFavorites = [...favoritesList, newFavorite];
    }

    saveFavoritesToStorage(updatedFavorites);
    return { success: true };
  };

  // Remover favorito
  const removerFavorito = (plateId) => {
    if (!isAuthenticated || !user?._id) {
      console.warn('FavoritesProvider: Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }
    if (!/^[0-9a-fA-F]{24}$/.test(plateId)) {
      console.error('FavoritesProvider: ID de prato inválido:', plateId);
      return { success: false, error: 'ID de prato inválido' };
    }

    console.log('FavoritesProvider: Removendo favorito:', plateId);
    const updatedFavorites = Array.isArray(favoritesList) ? favoritesList.filter((f) => f._id !== plateId) : [];
    saveFavoritesToStorage(updatedFavorites);
    return { success: true };
  };

  // Atualizar lista de favoritos
  const atualizarFavoritos = async () => {
    if (!isAuthenticated || !user?._id) {
      console.warn('FavoritesProvider: Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    const plateIds = Array.isArray(loadFavoritesFromStorage()) ? loadFavoritesFromStorage().map((prato) => prato._id) : [];
    console.log('FavoritesProvider: Atualizando favoritos:', plateIds);

    try {
      const result = await updateFavorites(plateIds);
      setRefetchFavorites(true)
      
      return result;
    } catch (error) {
      console.error('FavoritesProvider: Erro ao atualizar favoritos:', error.message);
      return { success: false, error: error.message };
    }
    
  };

  // Buscar favoritos do servidor
  const buscarFavoritos = async () => {
    if (!isAuthenticated || !user?._id) {
      console.warn('FavoritesProvider: Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const result = await getFavorites();
      if (result.success && result.data) {
        saveFavoritesToStorage(result.data.plates || []);
      } else if (!result.success && result.error) {
        // Só mostrar erro se não for problema de autenticação
        if (!result.error.includes('não autenticado') && !result.error.includes('unauthorized')) {
          console.error('FavoritesProvider: Erro ao buscar favoritos:', result.error);
        }
      }
      return result;
    } catch (error) {
      console.error('FavoritesProvider: Erro ao buscar favoritos:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Valor do contexto
  const value = {
    refetchFavorites,
    favoritos: favoritesList,
    toggleFavorito,
    removerFavorito,
    atualizarFavoritos,
    getFavorites: buscarFavoritos,
    favoritesLoading,
    favoritesError,
    isFavorited: (plateId) => Array.isArray(favoritesList) && favoritesList.some((f) => f._id === plateId),
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
