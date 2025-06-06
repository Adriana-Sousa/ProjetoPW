import './userPage.css';
import bgImage from '../../assets/FOTOBASE.JPG';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import { useCarrinho } from '../../context/carrinhoContext';
import { useFavoritos } from '../../hooks/useFavoritos';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserPage() {
  const { logout, user } = useAuth();
  const { carrinho } = useCarrinho();
 const { favoritos, removerFavorito } = useFavoritos();
  const [ultimasEscolhas, setUltimasEscolhas] = useState([]);
  const navigate = useNavigate();

 useEffect(() => {
    const ultimos = [...carrinho].slice(-3).reverse();
    setUltimasEscolhas(ultimos);
  }, [carrinho]);

  const handleLogout = () => {
    logout();
    navigate('/logout');
  };

  return (
    <div className="user-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="admin-icons-links">
        <Link to="/cardapio-user" className="admin-icon-link" title="Cardápio">
          <FiHome size={20} />
        </Link>
        <Link to="/cart" className="admin-icon-link" title="Carrinho">
          <FiShoppingCart size={20} />
        </Link>
        <Link to="/cardapio-user" className="admin-icon-link" title="Cardápio">
            <MdRestaurantMenu size={20} />
        </Link>
        <button className="admin-icon-link" title="Sair" onClick={handleLogout}>
          <FiLogOut size={20} />
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>Olá, {user?.name || 'Usuário'}</h1>
        </div>

        <div className="admin-section">
          <h2>Seus Favoritos</h2>
          {favoritos.length === 0 ? (
            <p>Nenhum prato favoritado ainda.</p>
          ) : (
            <ul>
              {favoritos.map((prato) => (
                <li key={prato._id}>
                  {prato.name}
                  <button onClick={() => removerFavorito(prato._id)} className="remover-btn">
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-section">
          <h2>Últimas Escolhas</h2>
          {ultimasEscolhas.length === 0 ? (
            <p>Você ainda não escolheu nenhum prato.</p>
          ) : (
            <ul>
              {ultimasEscolhas.map((prato) => (
                <li key={prato._id}>{prato.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;