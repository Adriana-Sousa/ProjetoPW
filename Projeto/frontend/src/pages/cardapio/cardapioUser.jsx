// src/pages/CardapioUsuario.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiHeart, FiLogOut, FiUser } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import bgImage from '../../assets/CARDAPIO.JPG';
import './cardapio.css';
import { useCarrinho } from '../../context/carrinhoContext';
import usePlatesServices from '../../services/plates';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../context/favoritesContext';

function CardapioUsuario() {
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const [busca, setBusca] = useState('');
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const { favoritos, toggleFavorito, favoritesLoading, favoritesError, isFavorited , atualizarFavoritos, getFavorites} = useFavorites();
  const navigate = useNavigate();
  const { carrinho, adicionarAoCarrinho, limparCarrinho } = useCarrinho();
  const { getAvailablePlates, platesList, platesLoading, refetchPlates } = usePlatesServices();
  const { logout, isAuthenticated, user } = useAuth();

  useEffect(() => {
    
    if (refetchPlates) {
      getAvailablePlates().catch(() => alert('Erro ao carregar pratos'));
      getFavorites;
    }
  }, [ getAvailablePlates, refetchPlates]);

  const abrirModal = (prato) => setPratoSelecionado(prato);
  const fecharModal = () => setPratoSelecionado(null);

  const handleLogout = () => {
    atualizarFavoritos();
    logout();
    navigate('/logout');
  };

  const handleToggleFavorito = async (prato) => {
    const result = await toggleFavorito(prato);
    if (!result.success) {
      alert(`Erro ao favoritar prato: ${result.error}`);
    }
  };

  const pratosFiltrados = platesList.filter((prato) =>
    prato.name.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="cardapio-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <nav className="cardapio-navbar">
        <input
          type="text"
          placeholder="Pesquisar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="search-input"
          aria-label="Pesquisar pratos"
        />
        <div className="nav-actions">
          <Link to="/" className="nav-icon-user" aria-label="Página inicial">
            <FiHome size={24} />
          </Link>
          <Link to="/user-page" className="nav-icon-user" aria-label="Perfil do usuário">
            <FiUser size={24} />
          </Link>
          <div className={`carrinho-container ${mostrarCarrinho ? 'ativo' : ''}`}>
            <FiShoppingCart
              size={24}
              className="nav-icon-user"
              onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
              aria-label="Toggle carrinho"
            />
            {carrinho.length > 0 && <span className="carrinho-count">{carrinho.length}</span>}
          </div>
           {/* Botão de logout */}
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Sair"
            aria-label="Sair"
          >
            <FiLogOut size={24} />
          </button>
        </div>
      </nav>
      {mostrarCarrinho && (
        <div
          className="carrinho-overlay"
          onClick={() => setMostrarCarrinho(false)}
        >
          <div
            className="carrinho-dropdown"
            onClick={e => e.stopPropagation()}
          >
            {carrinho.length === 0 ? (
              <p>Vazio</p>
            ) : (
              <>

                {carrinho.map((item, idx) => (
                  <div key={idx} className="carrinho-item">
                    <img src={item.imgUrl} alt={item.name} />
                    <span>{item.name}</span>
                    <span className="carrinho-qtd">x{item.quantidade || 1}</span>
                  </div>
                ))}
                <div className="carrinho-link-container">
                  <button
                  className="carrinho-esvaziar-btn"
                  onClick={limparCarrinho}
                  type="button"
                >
                  Esvaziar
                </button>
                <div className="carrinho-link-right">
                  <span className="carrinho-total-qtd">
                    Total: {carrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0)} itens
                  </span>
                  <Link to="/cart" className="ir-para-carrinho">
                    Ir para o Carrinho →
                  </Link>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      )}

      {favoritesError && (
        <p className="error" role="alert">
          Erro ao carregar favoritos: {favoritesError}
        </p>
      )}
      {platesLoading ? (
        <p className="loading">Carregando pratos...</p>
      ) : (
        <div className="pratos-grid">
          {pratosFiltrados.map((prato) => (
            <div key={prato._id} className="prato-card">
              <img src={prato.imgUrl} alt={prato.name} onClick={() => abrirModal(prato)} />
              <p>{prato.name}</p>
              <div className="favoritar-container">
                <button
                  className="favoritar-button"
                  onClick={() => handleToggleFavorito(prato)}
                  disabled={favoritesLoading}
                  aria-label={
                    isFavorited(prato._id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
                  }
                >
                  {isFavorited(prato._id) ? (
                    <FaHeart color="red" />
                  ) : (
                    <FiHeart color="gray" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pratoSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{pratoSelecionado.name}</h2>
            <img src={pratoSelecionado.imgUrl} alt={pratoSelecionado.name} />
            <p>{pratoSelecionado.description}</p>
            <p>
              <strong>R$ {pratoSelecionado.price.toFixed(2)}</strong>
            </p>
            <div className="modal-buttons">
               <button onClick={() => { adicionarAoCarrinho(pratoSelecionado); fecharModal(); }}>Adicionar ao carrinho</button>
              <button onClick={fecharModal}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardapioUsuario;