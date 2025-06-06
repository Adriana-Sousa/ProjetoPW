import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiHeart, FiLogOut, FiUser } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import bgImage from '../../assets/CARDAPIO.JPG';
import './cardapio.css';
import { useCarrinho } from '../../context/carrinhoContext';
import usePlatesServices from '../../services/plates';
import { useAuth } from '../../hooks/useAuth';
import { useFavoritos } from '../../hooks/useFavoritos';

function CardapioUsuario() {
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const [busca, setBusca] = useState('');
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const { favoritos, toggleFavorito } = useFavoritos();
  const navigate = useNavigate();
  const { carrinho, adicionarAoCarrinho } = useCarrinho();
  const { getAvailablePlates, platesList, platesLoading } = usePlatesServices();
  const { logout } = useAuth(); 


  useEffect(() => {
    getAvailablePlates();
  }, [getAvailablePlates]);

  const abrirModal = (prato) => setPratoSelecionado(prato);
  const fecharModal = () => setPratoSelecionado(null);


  const handleLogout = () => {
    logout();
    navigate('/logout');
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
      />
      <div className="nav-actions">
          <Link to="/" className="nav-icon">
            <FiHome size={24} />
          </Link>
          <Link to="/user-page" className="nav-icon">
            <FiUser size={24} />
          </Link>
          <div className={`carrinho-container ${mostrarCarrinho ? 'ativo' : ''}`}>
            <FiShoppingCart size={24} className="nav-icon" onClick={() => setMostrarCarrinho(!mostrarCarrinho)} />
            {carrinho.length > 0 && <span className="carrinho-count">{carrinho.length}</span>}
          </div>
          {/* Botão de logout */}
          <button className="logout-btn" onClick={handleLogout} title="Sair">
            <FiLogOut size={24} />
          </button>
      </div>
    </nav>
        {mostrarCarrinho && (
          <div className="carrinho-dropdown">
              {carrinho.length === 0 ? <p>Vazio</p> : (
                <>
                  {carrinho.map((item, idx) => (
                    <div key={idx} className="carrinho-item">
                      <img src={item.imgUrl} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                  <Link to="/cart" className="ir-para-carrinho">Ir para o Carrinho →</Link>
                </>
              )}
          </div>
          
        )}

      {platesLoading ? <p className="loading">Carregando pratos...</p> : (
        <div className="pratos-grid">
          {pratosFiltrados.map((prato) => (
            <div key={prato._id} className="prato-card">
              <img src={prato.imgUrl} alt={prato.name} onClick={() => abrirModal(prato)} />
              <p>{prato.name}</p>
              <div className="favoritar-container">
                <button className="favoritar-button" onClick={() => toggleFavorito(prato)}>
                  {favoritos.some(f => f._id === prato._id) ? (
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
            <p><strong>R$ {pratoSelecionado.price.toFixed(2)}</strong></p>
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
